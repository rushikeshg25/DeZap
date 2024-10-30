import React from 'react';
import Icon from './ui/icon';

interface FeatureProps extends React.HTMLProps<HTMLDivElement> {
  bold: string;
  normal: string;
  boldFirst?: boolean;
}
export const Feature: React.FC<FeatureProps> = ({
  bold,
  normal,
  boldFirst = true,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Icon icon="check" className="h-4 aspect-square" />
      <span className="text-sm">
        {boldFirst ? <b>{bold}</b> : normal}{' '}
        {boldFirst ? normal : <b>{bold}</b>}
      </span>
    </div>
  );
};
