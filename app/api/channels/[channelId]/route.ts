import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
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
    if (!params.channelId) {
      return NextResponse.json(
        { error: "Channel ID Missing" },
        { status: 400 }
      );
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.MODERATOR, MemberRole.ADMIN] }
          }
        }
      },
      data: {
        channels: {
          delete: { id: params.channelId, name: { not: "general" } }
        }
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNEL_ID_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await request.json();
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      );
    }
    if (!serverId) {
      return NextResponse.json({ error: "Server ID Missing" }, { status: 400 });
    }
    if (!params.channelId) {
      return NextResponse.json(
        { error: "Channel ID Missing" },
        { status: 400 }
      );
    }
    if (name === "general") {
      return NextResponse.json(
        { error: "Name can't be 'general'" },
        {
          status: 400
        }
      );
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.MODERATOR, MemberRole.ADMIN] }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: { id: params.channelId, NOT: { name: "general" } },
            data: { name, type }
          }
        }
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNEL_ID_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
