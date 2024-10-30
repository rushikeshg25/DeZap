"use server"
import z from "zod"
import prisma from "@repo/db"

const signInSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    publicKey: z.string()
})

export const signin = async (body: any) => {
    const { success } = signInSchema.safeParse(body);

    if(!success){
        return { message: "Incorrect Inputs" }
    }
    const newUser = await prisma.user.create({data:{
                        publicKey: body.publicKey
                    }});
    if(!newUser) return { message: "User Creation Failed!!" } 
    
    return { message: "User created successfully", user: newUser }
}