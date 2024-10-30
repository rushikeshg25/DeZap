import {
  Client,
  GatewayIntentBits,
  REST,
  Interaction,
  ChannelType,
  PermissionFlagsBits,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  GuildMember,
  ButtonStyle,
  TextInputStyle,
  Guild,
} from 'discord.js';
import dotenv from 'dotenv';
import prisma from '../../db/index';
dotenv.config();

const TOKEN = process.env.TOKEN! as string;
const CLIENT_ID = process.env.CLIENT_ID! as string;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function sendVerificationMessage(channel: TextChannel) {
  const verificationEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Solana Wallet Verification')
    .setDescription(
      'To gain access to the server, we require you to complete our Solana wallet verification. Please use the button below to submit and verify your wallet address.'
    )
    .setFooter({
      text: 'Disclaimer: Server administrators may view the data collected throughout the verification process',
    });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('start_verification')
      .setLabel('Start Wallet Verification')
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({ embeds: [verificationEmbed], components: [row] });
}

export async function createPrivateChannel(guild: Guild, username: string) {
  try {
    const fetchedMembers = await guild.members.fetch({
      query: username,
      limit: 1,
    });
    const member = fetchedMembers.first();

    if (!member) {
      throw new Error('User not found in this server');
    }

    const channel = await guild.channels.create({
      name: `private-${username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id: member.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
      ],
    });
    return channel;
  } catch (error) {
    console.error('Error creating private channel:', error);
    throw error;
  }
}

export async function replyToUser(
  userId: string,
  data: string,
  channelId: string,
  isGreeting = false
) {
  try {
    const user = await client.users.fetch(userId);
    const userMention = `<@${user.id}>`;
    const channel = await client.channels.fetch(channelId);
    if (channel && channel.isTextBased()) {
      isGreeting
        ? await channel.send(`${userMention} ${data}`)
        : await channel.send(`${userMention} Update: ${data}`);
      console.log(`Reply sent to ${user.tag}`);
      return { success: true, message: `Reply sent to ${user.tag}` };
    } else {
      throw new Error('Channel not found or not text-based');
    }
  } catch (error) {
    console.error('Error replying to user:', error);
    return {
      success: false,
      message: 'There was an error trying to send the reply.',
    };
  }
}

async function verifyWallet(publicKey: string) {
  // Implement your wallet verification logic here
  const user = await prisma.user.findUnique({
    where: {
      publicKey: publicKey,
    },
  });
  return user ? user : null;
}
async function addUserEntryInDB(user: any, userId: string, channelId: string) {
  const newEntry = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      notifications: {
        create: {
          type: 'DISCORD',
          notificationId: userId,
          channelId,
        },
      },
    },
  });

  return !!newEntry;
}

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isButton() && interaction.customId === 'start_verification') {
    const modal = new ModalBuilder()
      .setCustomId('wallet_verification_modal')
      .setTitle('Enter Your Solana Wallet Address');

    const walletInput = new TextInputBuilder()
      .setCustomId('wallet_pubkey')
      .setLabel('WHAT IS YOUR SOLANA WALLET ADDRESS?')
      .setStyle(TextInputStyle.Short);

    const firstActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(walletInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }

  if (
    interaction.isModalSubmit() &&
    interaction.customId === 'wallet_verification_modal'
  ) {
    const publicKey = interaction.fields.getTextInputValue('wallet_pubkey');
    const member = interaction.member as GuildMember;
    const verifiedRole = interaction.guild?.roles.cache.find(
      (role) => role.name === 'Verified'
    );

    const verificationSuccess = await verifyWallet(publicKey);
    console.log(verificationSuccess);

    if (verificationSuccess !== null) {
      if (verifiedRole != null && interaction.member) {
        if (member.roles.cache.has(verifiedRole.id)) {
          await interaction.reply({
            content: 'You already have a channel for notifications!',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'Your Solana wallet has been verified successfully!',
            ephemeral: true,
          });
        }
      } else {
        await interaction.reply({
          content:
            'There was an error verifying your wallet. Please try again later.',
          ephemeral: true,
        });
      }
      // @ts-ignore
      if (
        interaction.guild &&
        interaction.user &&
        //@ts-ignore
        !member.roles.cache.has(verifiedRole.id)
      ) {
        const channel = await createPrivateChannel(
          interaction.guild,
          interaction.user.username
        );
        if (!channel) {
          await interaction.reply({
            content: 'You already have a channel for notifications!',
            ephemeral: true,
          });
        }
        await replyToUser(
          interaction.user.id,
          `Gm Gm 👋, Welcome to the DeZap! We'll be sending you notifications related to activity on your wallet in this channel. Don't Worry this is a private channel, nobody can access it other than you.`,
          channel.id,
          true
        );
        await member.roles.add(verifiedRole!);
        console.log('created channel id ', channel.id);
        const isAdded = await addUserEntryInDB(
          verificationSuccess,
          interaction.user.id,
          channel.id
        );
        if (isAdded) {
          console.log('added user to DB');
        } else {
          await member.roles.remove(verifiedRole!);
          await interaction.reply({
            content: 'something went wrong!, please try again',
            ephemeral: true,
          });
          console.log('error occured while adding user in DB');
        }
      }
    } else {
      await interaction.reply({
        content: 'Verification failed. Please try again.',
        ephemeral: true,
      });
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  try {
    console.log(`${member.user.username} has joined the server!`);
    const guild = member.guild;

    const verificationChannel = guild.channels.cache.find(
      (channel) => channel.name === 'welcome'
    ) as TextChannel;
    if (verificationChannel) {
      await verificationChannel.send(
        `Welcome <@${member.id}>! Please verify your Solana wallet to gain access to the server.`
      );
    }
  } catch (error) {
    console.error('Error handling new member join:', error);
  }
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  const guild = client.guilds.cache.first();
  if (guild) {
    const verificationChannel = guild.channels.cache.find(
      (channel) => channel.name === 'verification'
    ) as TextChannel;
    if (verificationChannel) {
      await sendVerificationMessage(verificationChannel);
    }
  }
});

export function getClient() {
  return client;
}

client.login(TOKEN);
