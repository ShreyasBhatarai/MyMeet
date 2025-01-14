'use client'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"
import {v4 as uuidv4} from 'uuid';
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from "@/components/ui/input"


const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setmeetingstate]=useState<'isScheduleMeeting'| 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const {user }= useUser();
    const client = useStreamVideoClient();
     const[values,setValues] = useState({
      dateTime: new Date(),
      description:"",
      link:'',
     })

     const [callDetails,setCallDetails]= useState<Call>();
     const { toast } = useToast();

    const createMeeting= async ()=>{
      if(!client || !user) return;

      try {
        if(!values.dateTime){
          toast({
            title: "Please select a date and time"})
            return;
        }

        const id =  uuidv4();;
        const call = client.call("default",id);

        if(!call) throw new Error("Failed to create call");

        const startsAt = values. dateTime.toISOString() || new Date
(Date.now()).toISOString();  


        const description= values.description || "Instant meeting"

        await call.getOrCreate({
          data:{
            starts_at: startsAt,
            custom:{
              description
            }
          }
        })
        setCallDetails(call);

        if(!values.description){
          router.push(`/meeting/${call.id}`)
        }

        toast({
          title: `Meeting Created with id :${call.id} `,
        
        })
      } catch (error) {
        console.log(error)

        toast({
          title: `Failed to create a meeting because ${error}`,
});
        
      }

    }
    const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
 <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
   <HomeCard 
   img="/icons/add-meeting.svg"
   title="New Meeting"
   description="Start an instant meeting"
   handleClick={()=>setmeetingstate('isInstantMeeting')}
   className="bg-orange-1"
   />
   <HomeCard
    img="/icons/schedule.svg"
    title="Schedule Meeting"
    description="Plan your meeting"
    handleClick={()=>setmeetingstate('isScheduleMeeting')}
    className="bg-blue-1"
    />
   <HomeCard
    img="/icons/recordings.svg" 
    title="View Recordings"
    description="Check out your recordings"
    handleClick={()=>router.push('/recordings')}
    className="bg-purple-1"
    />
   <HomeCard
    img="/icons/join-meeting.svg"
    title="Join Meeting"
    description="Via invitation Link"
    handleClick={()=>setmeetingstate('isJoiningMeeting')}
    className="bg-yellow-1"
   />


   {!callDetails?(
    <MeetingModal 
    isOpen={meetingState==="isScheduleMeeting"}
    onClose={()=>setmeetingstate(undefined)}
    title="Create Meeting"
    handleClick={createMeeting}
    >
      <div className='flex flex-col gap-2.5'>
        <label htmlFor="" className='text-base text-normal leading-[22px] text-sky-2'> Add a Description</label>
      <Textarea className='border-none focus:visible bg-blue-950 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e)=>{
        setValues({...values,description:e.target.value})
      }}/>
      </div>
      <div className='flex w-full flex-col gap-2.5 '>
      <label htmlFor="" className='text-base text-normal leading-[22px] text-sky-2'> Select Data and Time</label>
     <ReactDatePicker
      selected={values.dateTime}
      onChange={(date)=> setValues({...values,dateTime:date!})}
      showTimeSelect
      timeFormat='HH:mm'
      timeIntervals={15}
      timeCaption='Time'
      dateFormat="MMMM d, yyyy h:mm aa"
      className='w-full rounded bg-blue-950 p-2 focus:outline-none'
     />
      </div>
    </MeetingModal>
  
      

   ):(
    <MeetingModal 
     isOpen={meetingState==="isScheduleMeeting"}
     onClose={()=>setmeetingstate(undefined)}
     title="Meeting Created"
     className="text-center"
     handleClick={()=>{
      navigator.clipboard.writeText(meetingLink);
      toast({
        title: "Link Copied",
});
     }}
     image='/icons/checked.svg'
     buttonIcon='/icons/copy.svg'
     buttonText="Copy Meeting Link"
   />
   )}
 
   <MeetingModal 
     isOpen={meetingState==="isInstantMeeting"}
     onClose={()=>setmeetingstate(undefined)}
     title="Start an Instant Meeting"
     className="text-center"
     buttonText="Start Meeting"
     handleClick={createMeeting}
   />
   <MeetingModal 
     isOpen={meetingState==="isJoiningMeeting"}
     onClose={()=>setmeetingstate(undefined)}
     title="Type the link here"
     className="text-center"
     buttonText="Join Meeting"
     handleClick={()=>router.push(values.link)}
   >
    <Input placeholder='Meeting Link'
    className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
    onChange={(e)=> setValues({...values,link:e.target.value})}/>
   </MeetingModal>
 </section>
  )
}

export default MeetingTypeList
