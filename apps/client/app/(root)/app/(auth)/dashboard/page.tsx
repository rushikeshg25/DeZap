import prisma from "@repo/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotificationType } from "@repo/db/types";
import { IconProps } from "@/components/ui/icon";
import ServiceCard from "@/components/Services";

const services: {
  title: string;
  desc: string;
  icon: IconProps["icon"];
  service: NotificationType;
}[] = [
  {
    title: "Discord",
    desc: "Receive instant notifications on Discord for every Solana transaction, keeping you updated in real-time.",
    icon: "discord",
    service: NotificationType.DISCORD,
  },
  {
    title: "SMS",
    desc: "Get transaction alerts directly to your phone via SMS, ensuring you're always informed, even on the go.",
    icon: "sms",
    service: NotificationType.SMS,
  },
  {
    title: "Telegram",
    desc: "Stay on top of your Solana transactions with Telegram notifications, offering quick and reliable updates.",
    icon: "telegram",
    service: NotificationType.TELEGRAM,
  },
  {
    title: "Email",
    desc: "Receive detailed email reports for each transaction, perfect for record-keeping and timely updates.",
    icon: "email",
    service: NotificationType.EMAIL,
  },
];

const page = async () => {
  const session = await auth();
  if (!session) return redirect("/");
  const userServices = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className='flex flex-1'>
      <div className='p-2 md:p-10 grid grid-cols-2 gap-4 flex-1 w-full h-full'>
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            service={service}
            Userservices={userServices}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
