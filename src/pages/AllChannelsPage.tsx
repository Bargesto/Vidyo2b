import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import ChannelAvatar from '../components/ChannelAvatar';
import { Video } from '../types';

const AllChannelsPage = () => {
  const { channelName } = useParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<string[]>([]);

  useEffect(() => {
    const storedVideos = JSON.parse(localStorage.getItem('videos') || '[]') as Video[];
    setVideos(storedVideos);

    // Extract unique channel names
    const uniqueChannels = Array.from(
      new Set(storedVideos.map((video: Video) => video.channelName))
    ).sort();
    setChannels(uniqueChannels);
  }, []);

  const filteredVideos = channelName
    ? videos.filter(video => video.channelName === channelName)
    : videos;

  return (
    <div className="p-6">
      {/* ... rest of the component remains the same ... */}
    </div>
  );
};

export default AllChannelsPage;
