import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { role } = await request.json();

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized. Please sign in to continue.", {
        status: 401
      });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }
    if (!role) {
      return new NextResponse("Role Missing", { status: 400 });
    }
    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          update: {
            where: { id: params.memberId, profileId: { not: profile.id } },
            data: { role }
          }
        }
      },
      include: {
        members: { include: { profile: true }, orderBy: { role: "asc" } }
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[MEMBER_ID_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized. Please sign in to continue.", {
        status: 401
      });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: { not: profile.id }
          }
        }
      },
      include: {
        members: { include: { profile: true }, orderBy: { role: "asc" } }
      }
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[MEMBER_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
