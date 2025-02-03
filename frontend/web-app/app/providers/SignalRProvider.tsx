'use client';

import { useAuctionStore } from '@/hooks/useAuctionStore';
import { useBidStore } from '@/hooks/useBidStore';
import { Auction, AuctionFinished, Bid } from '@/types';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useParams } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import AuctionCreatedToast from '../components/AuctionCreatedToast';
import toast from 'react-hot-toast';
import { getDetailedViewData } from '../actions/auctionActions';
import AuctionFinishedToast from '../components/AuctionFinishedToast';
import { User } from 'next-auth';

type Props = {
  children: ReactNode;
  notifyUrl: string;
  user: User | null;
};

export default function SignalRProvider({ children, notifyUrl, user }: Props) {
  const connection = useRef<HubConnection | null>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBid = useBidStore((state) => state.addBid);
  const params = useParams<{ id: string }>();

  const handleAuctionFinished = useCallback(
    (finishedAuction: AuctionFinished) => {
      const auction = getDetailedViewData(finishedAuction.auctionId);
      return toast.promise(
        auction,
        {
          loading: 'Loading',
          success: (auction: Auction) => (
            <AuctionFinishedToast
              auction={auction}
              finishedAuction={finishedAuction}
            />
          ),
          error: () => 'Auction finished',
        },
        { success: { duration: 10000, icon: null } }
      );
    },
    []
  );

  const handleAuctionCreated = useCallback(
    (auction: Auction) => {
      if (user?.username !== auction.seller) {
        return toast(<AuctionCreatedToast auction={auction} />, {
          duration: 10000,
        });
      }
    },
    [user?.username]
  );

  const handleBidPlaced = useCallback(
    (bid: Bid) => {
      if (bid.bidStatus.includes('Accepted')) {
        setCurrentPrice(bid.auctionId, bid.amount);
      }

      if (params.id === bid.auctionId) {
        addBid(bid);
      }
    },
    [setCurrentPrice, addBid, params.id]
  );

  useEffect(() => {
    if (!connection.current) {
      console.log('🔌 Creating SignalR connection...');
      connection.current = new HubConnectionBuilder()
        .withUrl(notifyUrl)
        .withAutomaticReconnect()
        .build();

      connection.current
        .start()
        .then(() => console.log('✅ Connected to notification hub'))
        .catch((err) => console.log(err));
    }

    if (connection.current) {
      console.log('🟢 SignalR Listeners Added');

      connection.current.on('BidPlaced', handleBidPlaced);
      connection.current.on('AuctionCreated', handleAuctionCreated);
      connection.current.on('AuctionFinished', handleAuctionFinished);
    }

    return () => {
      if (connection.current) {
        console.log('🔴 SignalR Listeners Removed');

        connection.current?.off('BidPlaced', handleBidPlaced);
        connection.current?.off('AuctionCreated', handleAuctionCreated);
        connection.current?.off('AuctionFinished', handleAuctionFinished);
      }
    };
  }, [
    setCurrentPrice,
    handleBidPlaced,
    handleAuctionCreated,
    handleAuctionFinished,
    notifyUrl,
  ]);

  return children;
}
