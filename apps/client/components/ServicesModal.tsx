'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DialogContent, DialogHeader, DialogDescription } from './ui/dailog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import { sendSMSOTP } from '@/actions/validateOTP/sendSMSOTP';
import { verifyEmailOTPAction } from '@/actions/validateOTP/email';
import { verifySMSOTPAction } from '@/actions/validateOTP/sms';
import { sendEmailOTP } from '@/actions/validateOTP/sendEmailOTP';
import Icon from './ui/icon';

interface ServiceModalProps {
  service: 'Discord' | 'SMS' | 'Telegram' | 'Email';
  closeModal: () => void;
}

const ServicesModal = ({ service, closeModal }: ServiceModalProps) => {
  const EmailFormSchema = z.object({
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
  });

  const Emailform = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: '',
    },
  });
  const SMSFormSchema = z.object({
    sms: z.string().min(13, {
      message: 'Not a valid phone number.',
    }),
  });

  const SMSform = useForm<z.infer<typeof SMSFormSchema>>({
    resolver: zodResolver(SMSFormSchema),
    defaultValues: {
      sms: '',
    },
  });
  const [copy, setCopy] = useState(false);
  const { data: session } = useSession();
  const [formNum, setFormNum] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (service === 'Telegram') {
    return (
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader className='flex items-center w-full'>
          <> Integrate Telegram for Notifications</>
        </DialogHeader>
        <DialogDescription>
          <ol className='flex flex-col gap-2'>
            <li>You will be redirected to DeZap Telegram Bot&apos;s Chat</li>
            <li>Copy the message below and send it to the bot</li>
            <li className='flex flex-row gap-3 items-center justify-between border border-secondary rounded-lg my-1'>
              <div className='w-full items-center flex justify-center '>
                <div className='font-extrabold text-lg'>{`/verify ${session?.user?.id}`}</div>
              </div>
              <Button
                className='m-1'
                variant={'outline'}
                onClick={(event) => {
                  event?.stopPropagation();
                  setCopy(true);
                  navigator.clipboard.writeText(`/verify ${session?.user?.id}`);
                  setTimeout(() => {
                    setCopy(false);
                  }, 2000);
                }}
              >
                {!copy ? (
                  <Icon icon='copy' size={15} />
                ) : (
                  <Icon icon='check' className='text-green-400' size={15} />
                )}
              </Button>
            </li>
          </ol>
        </DialogDescription>

        <Button asChild>
          <Link
            target='_blank'
            href={
              'https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3DdeZap_bot'
            }
          >
            Connect
          </Link>
        </Button>
      </DialogContent>
    );
  }

  if (service === 'Email') {
    const onSubmitEmail = async (data: z.infer<typeof EmailFormSchema>) => {
      try {
        setIsLoading(true);
        const { sucess } = await sendEmailOTP(
          data.email,
          session?.user?.id as string
        );
        if (sucess) {
          toast({
            title: 'Email sent successfully',
            description: 'Please check your email for the OTP',
          });
          setFormNum(1);
        } else {
          toast({
            title: 'Error sending email',
            description: 'Please try again',
          });
        }
      } catch (error) {
        toast({
          title: 'Error sending email',
          description: 'Please try again',
        });
      }
      setIsLoading(false);
    };

    const verifyEmailOTP = async (OTP: string) => {
      setIsLoading(true);
      try {
        const { verified } = await verifyEmailOTPAction(
          OTP,
          session?.user?.id as string
        );
        if (verified === 'true')
          toast({
            title: 'Email verified successfully',
          });
        else if (verified === 'false')
          toast({
            title: 'Invalid OTP',
            description: 'Please try again',
          });
        else if (verified === 'error')
          toast({
            title: 'Error verifying OTP',
            description: 'Please try again',
          });
      } catch (error) {
        toast({
          title: 'Error verifying OTP',
          description: 'Please try again',
        });
      }
      setIsLoading(false);
      closeModal();
    };
    return (
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader className='flex flex-row  w-full gap-14'>
          {formNum === 1 && (
            <div onClick={() => setFormNum(0)} className='hover:cursor-pointer'>
              <Icon icon='hide' />
            </div>
          )}
          <>Integrate Email for Notifications</>
        </DialogHeader>
        <DialogDescription>
          {formNum === 0 ? (
            <div className='w-full flex flex-col gap-4'>
              <Form {...Emailform}>
                <form
                  onSubmit={Emailform.handleSubmit(onSubmitEmail)}
                  className='space-y-8'
                >
                  <FormField
                    control={Emailform.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='jondoe@gmail.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? (
                      <Icon
                        icon='spinner'
                        className='mr-2 h-4 w-4 animate-spin'
                      />
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <OTPModal verifyOTP={verifyEmailOTP} type='Email' />
          )}
        </DialogDescription>
      </DialogContent>
    );
  }

  if (service === 'SMS') {
    const onSubmitSMS = async (data: z.infer<typeof SMSFormSchema>) => {
      setIsLoading(true);
      try {
        const { sucess } = await sendSMSOTP(
          data.sms,
          session?.user?.id as string
        );
        if (sucess) {
          toast({
            title: 'OTP sent successfully',
            description: 'Please check your SMS for the OTP',
          });
          setFormNum(1);
        } else {
          toast({
            title: 'Error sending SMS',
            description: 'Please try again',
          });
        }
      } catch (error) {
        toast({
          title: 'Error sending SMS',
          description: 'Please try again',
        });
      }
      setIsLoading(false);
    };

    const verifySMSOTP = async (OTP: string) => {
      setIsLoading(true);
      try {
        const { verified } = await verifySMSOTPAction(
          OTP,
          session?.user?.id as string
        );
        if (verified === 'true')
          toast({
            title: 'Phone Number verified successfully',
          });
        else if (verified === 'false')
          toast({
            title: 'Invalid OTP',
            description: 'Please try again',
          });
        else if (verified === 'error')
          toast({
            title: 'Error verifying OTP',
            description: 'Please try again',
          });
      } catch (error) {
        toast({
          title: 'Error verifying OTP',
          description: 'Please try again',
        });
      }
      setIsLoading(false);
      closeModal();
    };
    return (
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader className='flex flex-row  w-full gap-14'>
          {formNum === 1 && (
            <div onClick={() => setFormNum(0)} className='hover:cursor-pointer'>
              <Icon icon='hide' />
            </div>
          )}
          <>Integrate SMS for Notifications</>
        </DialogHeader>
        <DialogDescription>
          {formNum === 0 ? (
            <div className='w-full flex flex-col gap-4'>
              <Form {...SMSform}>
                <form
                  onSubmit={SMSform.handleSubmit(onSubmitSMS)}
                  className='space-y-8'
                >
                  <FormField
                    control={SMSform.control}
                    name='sms'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input placeholder='+911234567890' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full'>
                    {isLoading ? (
                      <Icon
                        icon='spinner'
                        className='mr-2 h-4 w-4 animate-spin'
                      />
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <OTPModal verifyOTP={verifySMSOTP} type='SMS' />
          )}
        </DialogDescription>
      </DialogContent>
    );
  }

  if (service === 'Discord') {
    return (
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader className='flex items-center w-full'>
          <> Integrate Discord for Notifications </>
        </DialogHeader>
        <DialogDescription className='mb-2'>
          <ol className='flex flex-col gap-2'>
            <li>You will be redirected to DeZap Discord Bot&apos;s Channel</li>
            <li>Complete the verification process</li>
          </ol>
        </DialogDescription>
        <Button asChild>
          <Link target='_blank' href={'https://discord.gg/Y3KCUBADsC'}>
            Connect
          </Link>
        </Button>
      </DialogContent>
    );
  }
};

export default ServicesModal;

const OTPModal = ({
  verifyOTP,
  type,
}: {
  verifyOTP: (OTP: string) => void;
  type: string;
}) => {
  const FormSchema = z.object({
    pin: z.string().min(4, {
      message: 'Your one-time password must be 4 characters.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    verifyOTP(data.pin);
  }
  return (
    <div className='flex items-center w-full justify-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-6'>
          <FormField
            control={form.control}
            name='pin'
            render={({ field }) => (
              <FormItem className='flex items-center justify-center w-full flex-col'>
                <FormControl className='flex justify-center w-full'>
                  <InputOTP maxLength={4} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your{' '}
                  {type === 'SMS' ? 'phone' : 'email'}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
