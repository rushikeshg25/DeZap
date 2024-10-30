"use server";
import prisma from "@repo/db";
import { revalidatePath } from "next/cache";

export const DisconnectService = async (id: string) => {
  await prisma.notification.delete({
    where: {
      id,
    },
  });
};

revalidatePath("/app/(auth)", "page");
