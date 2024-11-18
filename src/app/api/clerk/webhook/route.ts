import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userData = body.data
    if (body.type === 'user.created') {
        await db.user.create({
            data:{
                id: userData.id,
                firstName: userData.first_name,
                lastName: userData.last_name,
                imageUrl: userData.image_url,
                emailAddres: userData.email_addresses[0].email_address
            }
        })
        return NextResponse.json({ message: "Webhook received" }, { status: 201 });
    }
    if (body.type === 'user.updated') {
        await db.user.update({
            where:{
                id: userData.id
            },
            data:{
                firstName: userData.first_name ,
                lastName: userData.last_name ,
                imageUrl: userData.image_url
            }
        })
        console.log("user updated")
        return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    }
    if (body.type === 'user.deleted') {
        console.log("this is the id from clerk", userData.id)
        await db.user.delete({
            where:{
                id: userData.id
            }
        })
        console.log("user deleted")
        return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    }

    // Handle unexpected event types
    console.log("Unhandled event type:", body.type);
    return NextResponse.json({ error: "Unhandled event type" }, { status: 400 });

  } catch (error) {
    console.error("Error parsing request body:", error); // Handle any errors
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
