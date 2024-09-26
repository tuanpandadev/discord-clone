import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        {
          status: 401
        }
      );
    }
    const { imageUrl, name } = await request.json();

    const server = await db.server.create({
      data: {
        imageUrl,
        name,
        profileId: profile.id,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id
            }
          ]
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN
            }
          ]
        }
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVERS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
