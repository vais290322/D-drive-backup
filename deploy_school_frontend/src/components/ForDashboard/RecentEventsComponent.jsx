import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const RecentEventsComponent = () => {
    const [expandedEvent, setExpandedEvent] = useState(null);
    const role = useSelector((state) => state.auth.user);
    // console.log("role from edp dashboard : ", role);
    const {theme} = useTheme();
    const events = [
      {
        title: 'Event-1',
        date: '1st Jan, 2024',
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry standard dummy text ever since the 1500s.',
      },
      {
        title: 'Event-2',
        date: '25th Jan, 2024',
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      },
      {
        title: 'Event-3',
        date: '4th Feb, 2024',
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has survived not only five centuries but also the leap into electronic typesetting.',
      },
      {
        title: 'Event-4',
        date: '21st Mar, 2024',
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry standard since the 1500s.',
      },
      {
        title: 'Event-5',
        date: '5th Apr, 2024',
        description: 'Dummy text for testing.',
      },
      {
        title: 'Event-6',
        date: '10th May, 2024',
        description: 'Another dummy text for event display.',
      },
      {
        title: 'Event-7',
        date: '15th Jun, 2024',
        description: 'This is yet another dummy text for events.',
      },
    ];
  
    const handleExpand = (index) => {
      setExpandedEvent(index === expandedEvent ? null : index);
    };
    
      return (
        <div className={` rounded-lg shadow-lg p-6  max-w-lg  sm:mx-auto h-[666px] border  overflow-auto ${theme === "light" ? "bg-[#212121] text-white border-gray-800 " : "bg-white border-slate-200"} `}>
      <div className="mb-6">
        
        <div className="flex justify-between"> 
        <h3 className={`text-lg font-bold   ${theme === "light" ? " text-white  " : "text-gray-800"} `} >Recent Events</h3>
        {/* for add event button */}
        {role === "edp" && <Link to="/add-event">  <Button className="bg-[#2b65bb] hover:bg-[#34588f] ">Add Event</Button></Link>}
        
        </div>
        <a href="#!" className="text-sm text-blue-500 hover:underline">
          See our most recent events lists
        </a>
      </div>
      <div className={`relative border-l-2  pl-6 ${theme === "light" ? "border-[#969090]" : "border-green-500"} `}>
        {events.map((event, index) => (
          <div key={index} className="relative mb-8 last:mb-0">
            {/* Green Circle */}
            <div className={`absolute -left-8 top-1.5 w-4 h-4   border-2 border-white rounded-full ${theme === "light" ? "bg-[#969090]" : "bg-green-500"} `}></div>
            {/* Event Content */}
            <div className={` rounded-lg shadow-sm p-2 ${theme === "light" ? "bg-[#302c2c] text-white border-gray-800 " : 
              "bg-white border-slate-200"}`}>
              <h4 className={`text-base font-semibold ${theme === "light" ? " text-white  " : "text-gray-800"}`}>{event.title}</h4>
              <p className={`text-sm ${theme === "light" ? " text-white  " : "text-gray-800"}`}>
                {expandedEvent === index
                  ? event.description
                  : `${event.description.substring(0, 50)}...`}
                {event.description.length > 50 && (
                  <button
                    onClick={() => handleExpand(index)}
                    className="text-blue-500 ml-1"
                  >
                    {expandedEvent === index ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </p>
              <span className="text-xs text-gray-400">{event.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
      );
}

export default RecentEventsComponent