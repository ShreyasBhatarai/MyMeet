'use client'

import { useUser } from '@clerk/nextjs';
import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
  } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const userId = 'user-id';
  const token = 'authentication-token';
  const user: User = { id: userId };
  
  
  export const StreamVideoProvider  = ({children}:{children:ReactNode}) => {
    
    const [videoClient,setvideoClient]= useState <StreamVideoClient>();
    const {user,isLoaded} = useUser();
    useEffect(()=>{
        if(!isLoaded || !user) return;
        if(!apiKey) throw new Error ("API Missing")
            const client =new StreamVideoClient({
                apiKey,
                user:{
                    id: user?.id,
                    name: user?.username || user?.id,
                    image:user?.imageUrl,
                },
                tokenProvider,
            })
            setvideoClient(client)
    },[user,isLoaded]);

    if(!videoClient) return <Loader/>;
    
    return (
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    );
  };