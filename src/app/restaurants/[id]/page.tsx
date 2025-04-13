import { cookies } from "next/headers";

export default async function restaurant() {
  const cookie = await cookies();
  const role = await cookie.get('role')?.value;
  return (
      role=='admin'?null:<div className="">make reservation / get virtual queue</div>
    );
}

