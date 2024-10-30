import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

const map = new Map();
map.set(NotificationType.DISCORD, "DISCORD_ID");
map.set(NotificationType.EMAIL, "rushikeshisgamer@gmail.com");
map.set(NotificationType.SMS, "+917767054416");
map.set(NotificationType.TELEGRAM, "860953870");

async function seed() {
  const user = await prisma.user.create({
    data: { publicKey: "AEMcmukXVfpJJmApxE6E7iinuC7nYxnUAycTKUyMV63p" },
  });
  await prisma.notification.createMany({
    data: [
      {
        type: NotificationType.DISCORD,
        userId: user.id,
        notificationId: map.get(NotificationType.DISCORD),
      },
      {
        type: NotificationType.EMAIL,
        userId: user.id,
        notificationId: map.get(NotificationType.EMAIL),
      },
      {
        type: NotificationType.SMS,
        userId: user.id,
        notificationId: map.get(NotificationType.SMS),
      },
      {
        type: NotificationType.TELEGRAM,
        userId: user.id,
        notificationId: map.get(NotificationType.TELEGRAM),
      },
    ],
  });
}

async function main() {
  try {
    await seed();
    console.log("Seeding done ☘️");
  } catch (Error) {
    console.log("Error while seeding", Error);
    throw Error;
  }
}

main()
  .catch((error) => {
    console.error("An unexpected error occurred during seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
