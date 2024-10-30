'use client';
import { Notification } from '@repo/db/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { DisconnectService } from '@/actions/DisconnectService';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

const DisconnectServices = ({
  Userservices,
}: {
  Userservices: Notification[];
}) => {
  const { toast } = useToast();
  const handleDisconnect = async (id: string) => {
    try {
      await DisconnectService(id);
      toast({
        title: 'Disconnected successfully',
        description: 'You have successfully disconnected your service',
      });
    } catch (error) {
      toast({
        title: 'Error disconnecting service',
        description: 'Please try again',
      });
    }
  };
  return (
    <div className='flex flex-1 flex-col'>
      <div className='m-5 mx-10'>
        <h1 className='text-3xl font-semibold'>Connected Services</h1>
      </div>
      <div className='p-2 md:p-10  flex flex-col gap-4 flex-1 w-full h-full'>
        {Userservices.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-4'>
            <h1 className='text-3xl font-semibold'>No services connected</h1>
            <div className='text-sm'>Connect your services to get started</div>
            <Button asChild>
              <Link href={`/app/dashboard`}>Connect</Link>
            </Button>
          </div>
        ) : (
          Userservices.map((userService) => (
            <Card key={userService.id}>
              <CardHeader className='flex flex-row items-center justify-between'>
                <div className='flex flex-row  justify-end gap-4'>
                  <CardTitle>{userService.type}</CardTitle>
                  <div className=''>{`(${userService.notificationId})`}</div>
                </div>
                <Button
                  onClick={() => {
                    handleDisconnect(userService.id);
                  }}
                >
                  Disconnect
                </Button>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DisconnectServices;
