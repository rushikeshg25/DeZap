'use client';
import ServicesModal from '@/components/ServicesModal';
import { CardBody, CardContainer, CardItem } from '@/components/ui/card-pin';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dailog';
import Icon, { IconProps } from '@/components/ui/icon';
import { Notification, NotificationType } from '@repo/db/types';
import { useEffect, useState } from 'react';
import { revalid } from '@/actions/revalidate';
const ServiceCard = ({
  service,
  Userservices,
}: {
  service: {
    title: string;
    desc: string;
    icon: IconProps['icon'];
    service: NotificationType;
  };
  Userservices: Notification[];
}) => {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };
  useEffect(() => {
    const refetch = async () => {
      await revalid();
    };
    refetch();
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          disabled={
            Userservices.find(
              (userService) => userService.type === service.service
            ) != undefined
          }
        >
          <CardContainer className='inter-var' key={service.title}>
            <CardBody className='relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border-white/[0.2] rounded-xl p-6 border grid grid-rows-[max-content_max-content_1fr]'>
              <CardItem
                translateZ='50'
                className='flex w-full items-center justify-between'
              >
                <div className='text-xl font-bold'> {service.title}</div>
                {Userservices.find((a) => a.type === service.service) ? (
                  <Icon icon='circle-check' />
                ) : null}
              </CardItem>
              <CardItem
                as='p'
                translateZ='60'
                className='text-primary/70 text-sm max-w-md mx-auto mt-2 text-balance'
              >
                {service.desc}
              </CardItem>
              <CardItem
                translateZ='100'
                className='w-full mt-4 grid place-items-center'
              >
                <Icon icon={service.icon} className='w-36 h-36' />
              </CardItem>
            </CardBody>
          </CardContainer>
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader />
        <ServicesModal
          closeModal={close}
          service={service.title as 'Discord' | 'SMS' | 'Telegram' | 'Email'}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCard;
