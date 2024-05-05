import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const id = session?.user?.id;

    if (!id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findFirst({
      where: {
        id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
