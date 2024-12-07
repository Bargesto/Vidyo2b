import { useState, useEffect } from 'react';
import { Video, HeroContent, GRADES, SUBJECTS } from '../types';
import { Plus, X, Presentation, Trash2, ToggleLeft, ToggleRight, Edit2, Pin } from 'lucide-react';

const AdminPage = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent[]>([]);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    grade: GRADES[0],
    subject: SUBJECTS[0].id,
    channelName: ''
  });

  const [heroFormData, setHeroFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    standalone: false,
    includeVideos: true
  });

  useEffect(() => {
    const stored = localStorage.getItem('heroContent');
    if (stored) {
      setHeroContent(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (editingHero) {
      setHeroFormData({
        title: editingHero.title || '',
        description: editingHero.description || '',
        imageUrl: editingHero.imageUrl || '',
        link: editingHero.link || '',
        standalone: editingHero.standalone || false,
        includeVideos: editingHero.includeVideos !== false
      });
      setIsHeroModalOpen(true);
    }
  }, [editingHero]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract video ID from YouTube URL
    const videoId = formData.youtubeUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
      alert('Geçersiz YouTube URL');
      return;
    }

    const newVideo: Video = {
      id: Date.now().toString(),
      ...formData,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      watched: false,
      favorite: false,
      addedBy: 'admin'
    };

    // Get existing videos and add new one
    const existingVideos = JSON.parse(localStorage.getItem('videos') || '[]');
    localStorage.setItem('videos', JSON.stringify([...existingVideos, newVideo]));

    // Reset form and close modal
    setFormData({
      title: '',
      youtubeUrl: '',
      grade: GRADES[0],
      subject: SUBJECTS[0].id,
      channelName: ''
    });
    setIsVideoModalOpen(false);

    alert('Video başarıyla eklendi!');
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let updatedHeroContent;
    const newId = Date.now().toString();

    if (editingHero) {
      // Update existing hero
      updatedHeroContent = heroContent.map(hero => 
        hero.id === editingHero.id 
          ? { ...editingHero, ...heroFormData, active: hero.active }
          : hero
      );
    } else {
      // Add new hero
      const newHero: HeroContent = {
        id: newId,
        ...heroFormData,
        active: true
      };
      updatedHeroContent = [...heroContent, newHero];
    }

    // If this hero is standalone, make sure other heroes are not standalone
    if (heroFormData.standalone) {
      updatedHeroContent = updatedHeroContent.map(hero => ({
        ...hero,
        standalone: hero.id === (editingHero?.id || newId)
      }));
    }

    localStorage.setItem('heroContent', JSON.stringify(updatedHeroContent));
    setHeroContent(updatedHeroContent);

    // Reset form and close modal
    setHeroFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      standalone: false,
      includeVideos: true
    });
    setEditingHero(null);
    setIsHeroModalOpen(false);

    alert(`Hero içeriği başarıyla ${editingHero ? 'güncellendi' : 'eklendi'}!`);
  };

  const handleDeleteHero = (id: string) => {
    if (window.confirm('Bu hero içeriğini silmek istediğinizden emin misiniz?')) {
      const updatedHeroContent = heroContent.filter(hero => hero.id !== id);
      localStorage.setItem('heroContent', JSON.stringify(updatedHeroContent));
      setHeroContent(updatedHeroContent);
    }
  };

  const toggleHeroActive = (id: string) => {
    const updatedHeroContent = heroContent.map(hero =>
      hero.id === id ? { ...hero, active: !hero.active } : hero
    );
    localStorage.setItem('heroContent', JSON.stringify(updatedHeroContent));
    setHeroContent(updatedHeroContent);
  };

  const handleEditHero = (hero: HeroContent) => {
    setEditingHero(hero);
  };

  const handleCloseHeroModal = () => {
    setIsHeroModalOpen(false);
    setEditingHero(null);
    setHeroFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      standalone: false,
      includeVideos: true
    });
  };

  return (
    <div className="p-6">
      {/* ... rest of the component remains the same ... */}
    </div>
  );
};

export default AdminPage;
