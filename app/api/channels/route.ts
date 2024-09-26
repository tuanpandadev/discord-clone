import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await request.json();
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");
    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        {
          status: 401
        }
      );
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server ID Missing" }, { status: 400 });
    }
    if (name === "general") {
      return NextResponse.json(
        { error: "Name can't be 'general'" },
        { status: 400 }
      );
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: { channels: { create: { profileId: profile.id, name, type } } }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("CHANNELS_POST_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
