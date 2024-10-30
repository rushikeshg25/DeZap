import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/"} className="self-center flex gap-1">
      <p className="flex items-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60">
        StreamChain
      </p>
      <div>
        <span className="bg-brand text-white font-medium w-10 p-1 px-2 rounded-md h-5 text-sm">
          DEVNET
        </span>
      </div>
    </Link>
  );
};
