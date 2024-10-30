import {
  CircleCheckBig,
  Copyright,
  Heart,
  Loader2,
  Settings,
  Sparkles,
  type Icon as LucideIconType,
} from 'lucide-react';
import { CiBank } from 'react-icons/ci';
import {
  FaAddressBook,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCopy,
  FaDiscord,
  FaHammer,
  FaParachuteBox,
  FaSms,
  FaStream,
  FaTelegram,
} from 'react-icons/fa';
import { FaMoneyBill1Wave } from 'react-icons/fa6';
import { GiToken } from 'react-icons/gi';
import { MdDashboard, MdMail } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const icons = {
  airdrop: FaParachuteBox,
  stream:FaStream,
  'spl-token': GiToken,
  'mint-token': FaHammer,
  payments: FaMoneyBill1Wave,
  escrow: CiBank,
  'address-book': FaAddressBook,
  hide: FaArrowLeft,
  show: FaArrowRight,
  dashboard: MdDashboard,
  discord: FaDiscord,
  sms: FaSms,
  telegram: FaTelegram,
  email: MdMail,
  cross: RxCross2,
  copy: FaCopy,
  check: FaCheck,
  sparkle: Sparkles,
  heart: Heart,
  copyright: Copyright,
  'circle-check': CircleCheckBig,
  spinner: Loader2,
  services: Settings,
};
export type IconType = typeof LucideIconType;
export default icons;
