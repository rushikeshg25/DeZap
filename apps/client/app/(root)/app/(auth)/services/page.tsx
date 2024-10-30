import DisconnectServices from "@/components/DisconnectServices";
import prisma from "@repo/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Disconnect = async () => {
  const session = await auth();
  if (!session) redirect("/");
  const userServices = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
  });
  return <DisconnectServices Userservices={userServices} />;
};

export default Disconnect;
