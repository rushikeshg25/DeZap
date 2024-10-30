import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Page = () => {
  return (
    <div className="flex flex-1 h-full">
      <div className="p-2 md:p-10 grid w-full h-full place-items-center">
        <Card className="w-full max-w-md bg-black/5 border-brand-secondary/50 mb-[20%]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-200">Escrow Feature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <Icon icon="spinner" className="h-16 w-16 animate-spin text-brand-secondary" />
          </div>
          <p className="text-center text-gray-300 text-lg">
            Coming Soon
          </p>
          <p className="text-center text-gray-400">
            We&apos;re working hard to bring you secure and efficient escrow services.
          </p>
          <p className="text-center text-gray-400">
            Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Page;
