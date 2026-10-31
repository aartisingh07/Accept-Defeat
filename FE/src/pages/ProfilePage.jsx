import { useState, useEffect, useMemo, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  ShieldAlert,
  Lock,
  Globe,
  ExternalLink,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trophy,
  Swords,
  Flame,
  Award,
  Calendar,
  Sparkles,
  Eye,
  EyeOff,
  Code2,
  Camera,
  UploadCloud,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/useAuth';
import profileService from '../services/profileService';

const POPULAR_SKILLS = [
  'React',
  'Node.js',
  'Express.js',
  'MongoDB',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Docker',
  'SQL',
  'Git',
  'Next.js',
  'C++',
  'Go',
  'Tailwind CSS',
];

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();

  // Profile data state
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    socialLinks: {
      linkedin: '',
      github: '',
      leetcode: '',
      other: [],
    },
    skills: [],
  });

  // Separate Username Change State & Modal
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  // First-time Phone Setup State & Confirmation Modal
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneVisibilityInput, setPhoneVisibilityInput] = useState('private');
  const [isPhoneConfirmOpen, setIsPhoneConfirmOpen] = useState(false);
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Avatar upload & preview state
  const avatarInputRef = useRef(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [isRemoveAvatarModalOpen, setIsRemoveAvatarModalOpen] = useState(false);
  const [avatarRemoving, setAvatarRemoving] = useState(false);

  // Skill input state
  const [skillInput, setSkillInput] = useState('');

  // Notification states
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTime] = useState(() => Date.now());

  const populateFormData = (data) => {
    if (!data) return;
    setFormData({
      name: data.name || '',
      socialLinks: {
        linkedin: data.socialLinks?.linkedin || '',
        github: data.socialLinks?.github || '',
        leetcode: data.socialLinks?.leetcode || '',
        other: Array.isArray(data.socialLinks?.other) ? [...data.socialLinks.other] : [],
      },
      skills: Array.isArray(data.skills) ? [...data.skills] : [],
    });
  };

  // Fetch profile on initial mount
  useEffect(() => {
    let isMounted = true;

    profileService
      .getProfile()
      .then((data) => {
        if (!isMounted) return;
        setProfile(data);
        populateFormData(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Failed to load profile data.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Cleanup object URL preview on unmount or URL replacement
  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  // 30-day username calculation
  const usernameChangeInfo = useMemo(() => {
    if (!profile) return { eligible: true, message: '' };

    if (!profile.usernameLastChangedAt) {
      return { eligible: true, message: 'You have not changed your username yet.' };
    }

    const lastChanged = new Date(profile.usernameLastChangedAt).getTime();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const nextEligible = lastChanged + thirtyDaysMs;
    const diff = nextEligible - currentTime;

    if (diff <= 0) {
      return { eligible: true, message: 'You are eligible to change your username.' };
    }

    const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const formattedDate = new Date(nextEligible).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      eligible: false,
      daysRemaining,
      formattedDate,
      message: `You can change your username again on ${formattedDate} (${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining).`,
    };
  }, [profile, currentTime]);

  const showNotification = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(msg);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setErrorMessage(msg);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 7000);
    }
  };

  // Start Editing
  const handleStartEdit = () => {
    populateFormData(profile);
    setIsEditing(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    populateFormData(profile);
    setIsEditing(false);
    setErrorMessage('');
  };

  // Add / Remove Skills
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;

    if (formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      showNotification(`Skill "${trimmed}" is already in your skills list.`, false);
      return;
    }

    if (formData.skills.length >= 30) {
      showNotification('You can list at most 30 skills.', false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Add / Remove Custom Links
  const handleAddOtherLink = () => {
    if (formData.socialLinks.other.length >= 10) {
      showNotification('Maximum 10 custom links allowed.', false);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        other: [...prev.socialLinks.other, { name: '', url: '' }],
      },
    }));
  };

  const handleUpdateOtherLink = (index, field, value) => {
    setFormData((prev) => {
      const nextOther = [...prev.socialLinks.other];
      nextOther[index] = { ...nextOther[index], [field]: value };
      return {
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          other: nextOther,
        },
      };
    });
  };

  const handleRemoveOtherLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        other: prev.socialLinks.other.filter((_, idx) => idx !== index),
      },
    }));
  };

  // URL Validation Helper
  const validateUrl = (url) => {
    if (!url || !url.trim()) return true; // optional
    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Save Profile (Name, Social Links, Skills)
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate Name
    if (formData.name && formData.name.trim().length > 60) {
      showNotification('Full name must be at most 60 characters.', false);
      return;
    }

    // Validate Social URLs
    if (formData.socialLinks.linkedin && !validateUrl(formData.socialLinks.linkedin)) {
      showNotification('LinkedIn URL must start with https://', false);
      return;
    }
    if (formData.socialLinks.github && !validateUrl(formData.socialLinks.github)) {
      showNotification('GitHub URL must start with https://', false);
      return;
    }
    if (formData.socialLinks.leetcode && !validateUrl(formData.socialLinks.leetcode)) {
      showNotification('LeetCode URL must start with https://', false);
      return;
    }

    for (const link of formData.socialLinks.other) {
      if (link.url && !validateUrl(link.url)) {
        showNotification(`URL for "${link.name || 'custom link'}" must start with https://`, false);
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        socialLinks: {
          linkedin: formData.socialLinks.linkedin.trim(),
          github: formData.socialLinks.github.trim(),
          leetcode: formData.socialLinks.leetcode.trim(),
          other: formData.socialLinks.other
            .filter((l) => l.name?.trim() && l.url?.trim())
            .map((l) => ({ name: l.name.trim(), url: l.url.trim() })),
        },
        skills: formData.skills.map((s) => s.trim()),
      };

      const res = await profileService.updateProfile(payload);
      const updated = res.user || res;

      setProfile(updated);
      populateFormData(updated);
      updateUser({
        name: updated.name,
        skills: updated.skills,
        socialLinks: updated.socialLinks,
      });

      setIsEditing(false);
      showNotification('Developer profile updated successfully!');
    } catch (err) {
      showNotification(err.message || 'Failed to save changes.', false);
    } finally {
      setIsSaving(false);
    }
  };

  // Change Username Handler
  const handleSaveUsername = async (e) => {
    e.preventDefault();
    setUsernameError('');

    const trimmed = newUsername.trim();
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(trimmed)) {
      setUsernameError('Username must be 3-24 characters (letters, numbers, underscores only).');
      return;
    }

    if (trimmed.toLowerCase() === profile.username.toLowerCase()) {
      setUsernameError('New username is identical to your current username.');
      return;
    }

    setUsernameSaving(true);
    try {
      const res = await profileService.updateUsername(trimmed);
      const updatedUsername = res.username || trimmed;
      const updatedTimestamp = res.usernameLastChangedAt || new Date().toISOString();

      setProfile((prev) => ({
        ...prev,
        username: updatedUsername,
        usernameLastChangedAt: updatedTimestamp,
      }));

      updateUser({ username: updatedUsername });
      setIsUsernameModalOpen(false);
      setNewUsername('');
      showNotification(`Username successfully changed to @${updatedUsername}!`);
    } catch (err) {
      setUsernameError(err.message || 'Failed to change username.');
    } finally {
      setUsernameSaving(false);
    }
  };

  // First-time Phone Submit Handler (Opens Confirmation Dialog)
  const handleOpenPhoneConfirm = (e) => {
    e.preventDefault();
    setPhoneError('');

    const clean = phoneInput.replace(/[\s\-()]/g, '');
    if (!/^\+?[1-9]\d{6,14}$/.test(clean)) {
      setPhoneError('Please enter a valid international phone number (e.g., +1 555 123 4567).');
      return;
    }

    setIsPhoneConfirmOpen(true);
  };

  const handleConfirmSavePhone = async () => {
    setPhoneSaving(true);
    setPhoneError('');
    try {
      const res = await profileService.setPhone({
        phone: phoneInput.trim(),
        phoneVisibility: phoneVisibilityInput,
      });

      setProfile((prev) => ({
        ...prev,
        phone: res.phone || phoneInput.trim(),
        phoneVisibility: res.phoneVisibility || phoneVisibilityInput,
      }));

      updateUser({
        phone: res.phone || phoneInput.trim(),
        phoneVisibility: res.phoneVisibility || phoneVisibilityInput,
      });

      setIsPhoneConfirmOpen(false);
      setPhoneInput('');
      showNotification('Phone number securely saved to your developer account!');
    } catch (err) {
      setPhoneError(err.message || 'Failed to save phone number.');
      setIsPhoneConfirmOpen(false);
    } finally {
      setPhoneSaving(false);
    }
  };

  // Toggle Phone Visibility (Private / Public)
  const handleTogglePhoneVisibility = async (newVisibility) => {
    try {
      await profileService.updatePhoneVisibility(newVisibility);
      setProfile((prev) => ({
        ...prev,
        phoneVisibility: newVisibility,
      }));
      updateUser({ phoneVisibility: newVisibility });
      showNotification(`Phone visibility updated to ${newVisibility === 'public' ? 'Public' : 'Private'}.`);
    } catch (err) {
      showNotification(err.message || 'Failed to update visibility.', false);
    }
  };

  // Handle Avatar Selection (Hidden File Input)
  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so selecting same file again triggers onChange
    e.target.value = '';
    setAvatarError('');

    // Client-side MIME validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('Invalid file format. Please upload a JPEG, PNG, or WebP image.', false);
      return;
    }

    // Client-side file size validation (5 MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('Image size exceeds 5 MB. Please select a smaller image.', false);
      return;
    }

    // Generate local Object URL for instant preview
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }
    const preview = URL.createObjectURL(file);
    setSelectedAvatarFile(file);
    setAvatarPreviewUrl(preview);
    setIsAvatarModalOpen(true);
  };

  // Close Avatar Modal & Clean up Preview
  const handleCloseAvatarModal = () => {
    if (avatarUploading) return;
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
      setAvatarPreviewUrl(null);
    }
    setSelectedAvatarFile(null);
    setAvatarError('');
    setIsAvatarModalOpen(false);
  };

  // Confirm Avatar Upload to Cloudinary
  const handleConfirmAvatarUpload = async () => {
    if (!selectedAvatarFile) return;
    setAvatarUploading(true);
    setAvatarError('');

    try {
      const response = await profileService.uploadAvatar(selectedAvatarFile);
      const newAvatarUrl = response.avatar?.url || response.user?.avatar;
      const newPublicId = response.avatar?.publicId || response.user?.avatarPublicId;

      // Update local profile state
      setProfile((prev) => ({
        ...prev,
        avatar: newAvatarUrl,
        avatarPublicId: newPublicId,
      }));

      // Globally sync auth context so Topbar & Sidebar update immediately without page refresh
      if (updateUser) {
        updateUser({
          avatar: newAvatarUrl,
          avatarPublicId: newPublicId,
        });
      }

      showNotification('Profile picture updated successfully!');
      handleCloseAvatarModal();
    } catch (err) {
      setAvatarError(err.message || 'Failed to upload profile picture to Cloudinary.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Remove Custom Avatar (Restore Default Robot Avatar)
  const handleRemoveAvatar = async () => {
    setAvatarRemoving(true);
    try {
      await profileService.removeAvatar();
      const defaultAvatar = '/default-avatar.png';

      setProfile((prev) => ({
        ...prev,
        avatar: defaultAvatar,
        avatarPublicId: null,
      }));

      if (updateUser) {
        updateUser({
          avatar: defaultAvatar,
          avatarPublicId: null,
        });
      }

      showNotification('Profile picture restored to default robot avatar.');
      setIsRemoveAvatarModalOpen(false);
    } catch (err) {
      showNotification(err.message || 'Failed to reset avatar.', false);
    } finally {
      setAvatarRemoving(false);
    }
  };

  // Render Loading Skeleton
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-24 bg-[#0D1528] rounded-2xl border border-slate-800" />
          <div className="h-48 bg-[#0D1528] rounded-2xl border border-slate-800" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-[#0D1528] rounded-2xl border border-slate-800" />
            <div className="h-64 bg-[#0D1528] rounded-2xl border border-slate-800" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const userDisplayName = profile?.name || profile?.username || authUser?.username || 'Developer';
  const usernameHandle = `@${profile?.username || authUser?.username || 'developer'}`;
  const rawAvatar = profile?.avatar || authUser?.avatar;
  const avatarUrl =
    rawAvatar && !rawAvatar.includes('unsplash')
      ? rawAvatar
      : '/default-avatar.png';
  const hasCustomAvatar = Boolean(
    profile?.avatarPublicId ||
    authUser?.avatarPublicId ||
    (rawAvatar && !rawAvatar.includes('default-avatar.png') && !rawAvatar.includes('unsplash'))
  );

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const memberDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      })
    : '2026';

  const totalBattles = profile?.totalBattles || 0;
  const battlesWon = profile?.battlesWon || 0;
  const winRate = totalBattles > 0 ? `${Math.round((battlesWon / totalBattles) * 100)}%` : '0%';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Hidden File Input for Avatar Upload */}
        <input
          type="file"
          ref={avatarInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleAvatarSelect}
        />

        {/* Alerts Banner */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-emerald-400 hover:text-white cursor-pointer px-1"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-rose-400 hover:text-white cursor-pointer px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0D1528] border border-purple-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-purple-600/10 to-transparent pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>My Developer Profile</span>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Manage your identity, showcase your skills, and track your competitive journey.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none btn-primary-purple px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shadow-md shadow-purple-600/20"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                className="btn-primary-purple px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-purple-600/20"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Overview Card */}
        <div className="p-6 rounded-2xl bg-[#0D1528] border border-slate-800 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt={userDisplayName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-purple-500/40 shadow-md shadow-purple-900/20"
                />
                {/* Overlay camera button on hover/tap */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  title="Change avatar"
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-white backdrop-blur-[1px]"
                >
                  <Camera className="w-5 h-5 text-purple-300" />
                  <span className="text-[10px] font-medium text-slate-200">Change</span>
                </button>

                {/* Bottom-right camera trigger button */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  title="Upload new avatar"
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#070B14] border border-purple-500/40 text-purple-400 hover:text-white hover:bg-purple-600 transition-all cursor-pointer shadow-md"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {hasCustomAvatar && (
                <button
                  type="button"
                  onClick={() => setIsRemoveAvatarModalOpen(true)}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer pt-0.5"
                  title="Reset to default avatar"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset avatar</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {userDisplayName}
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-medium">
                  {usernameHandle}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{profile?.email}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-semibold">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-500 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {memberDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Rank & Points Highlights */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 text-center min-w-[105px]">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1 mb-1">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span>Rank</span>
              </div>
              <div className="text-base font-bold font-mono text-white">
                {profile?.rank ? `#${profile.rank}` : 'Unranked'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 text-center min-w-[105px]">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Points</span>
              </div>
              <div className="text-base font-bold font-mono text-amber-400">
                {profile?.points || 0} pts
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Basic Info, Contact Info, Social Links, Skills */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Basic Information Card */}
            <div className="p-6 rounded-2xl bg-[#0D1528] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>Basic Information</span>
                </div>
                {isEditing && (
                  <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                    Editing Mode
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="profile-fullname" className="block text-xs font-semibold text-slate-300">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        id="profile-fullname"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g. Alex Rivera"
                        maxLength={60}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Visible on your developer profile and certificates.
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-white p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80 font-medium">
                      {profile?.name || (
                        <span className="text-slate-500 italic">Not specified (click Edit Profile to add)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Username with 30-Day Limit Logic */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Username (Editable once per 30 days)
                    </label>
                    <span
                      className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                        usernameChangeInfo.eligible
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {usernameChangeInfo.eligible ? 'Change Available' : 'Cooldown Active'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-xs text-white p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80 font-mono font-medium flex items-center justify-between">
                      <span>@{profile?.username}</span>
                      {!usernameChangeInfo.eligible && (
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNewUsername(profile?.username || '');
                        setUsernameError('');
                        setIsUsernameModalOpen(true);
                      }}
                      disabled={!usernameChangeInfo.eligible}
                      className="px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                    >
                      Change Username
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{usernameChangeInfo.message}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Contact Information and Privacy Card */}
            <div className="p-6 rounded-2xl bg-[#0D1528] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  <span>Contact Information & Privacy</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email (Always Read-Only) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Primary Account Email
                    </label>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Non-editable</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80 font-mono flex items-center justify-between">
                    <span>{profile?.email}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Primary
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Associated with your authentication credentials and account security.
                  </span>
                </div>

                {/* Phone Number (Immutable Once Saved) */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Phone Number
                    </label>
                    {profile?.phone && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>Saved & Immutable</span>
                      </span>
                    )}
                  </div>

                  {profile?.phone ? (
                    /* Case A: Phone Already Saved (Read-Only) + Privacy Switcher */
                    <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-purple-400" />
                          <span className="font-mono text-xs text-white font-medium">
                            {profile.phone}
                          </span>
                        </div>

                        {/* Interactive Privacy Preference Toggle */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Visibility:</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleTogglePhoneVisibility(
                                profile.phoneVisibility === 'public' ? 'private' : 'public'
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                              profile.phoneVisibility === 'public'
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                          >
                            {profile.phoneVisibility === 'public' ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-400" />
                                <span>Public</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-slate-400" />
                                <span>Private</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 border-t border-slate-800/60 pt-2">
                        {profile.phoneVisibility === 'public'
                          ? 'Visible to other coders on your public developer profile.'
                          : 'Kept strictly private and confidential. Never exposed in public directories.'}
                      </p>
                    </div>
                  ) : (
                    /* Case B: First-time Phone Setup */
                    <form onSubmit={handleOpenPhoneConfirm} className="p-4 rounded-xl bg-[#070B14] border border-purple-500/20 space-y-3.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                        <Phone className="w-4 h-4 text-purple-400" />
                        <span>Add Phone Number (One-time Setup)</span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Add a verified mobile number for account notifications and security alerts.
                        <span className="block text-amber-300 font-medium mt-1">
                          ⚠️ Note: Once saved, your phone number cannot be changed or deleted.
                        </span>
                      </p>

                      <div className="space-y-2">
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="+1 555 123 4567"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1528] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono transition-colors"
                        />

                        {phoneError && (
                          <p className="text-[11px] text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{phoneError}</span>
                          </p>
                        )}
                      </div>

                      {/* Privacy Preference Selection */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-300">
                          Privacy Preference
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <label
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                              phoneVisibilityInput === 'private'
                                ? 'bg-purple-950/30 border-purple-500/50 text-white'
                                : 'bg-[#0D1528] border-slate-800 text-slate-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="phoneVisibility"
                              value="private"
                              checked={phoneVisibilityInput === 'private'}
                              onChange={() => setPhoneVisibilityInput('private')}
                              className="accent-purple-500"
                            />
                            <div>
                              <span className="font-semibold block">Private (Default)</span>
                              <span className="text-[10px] text-slate-500 block">Hidden from public</span>
                            </div>
                          </label>

                          <label
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                              phoneVisibilityInput === 'public'
                                ? 'bg-purple-950/30 border-purple-500/50 text-white'
                                : 'bg-[#0D1528] border-slate-800 text-slate-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="phoneVisibility"
                              value="public"
                              checked={phoneVisibilityInput === 'public'}
                              onChange={() => setPhoneVisibilityInput('public')}
                              className="accent-purple-500"
                            />
                            <div>
                              <span className="font-semibold block">Public</span>
                              <span className="text-[10px] text-slate-500 block">Shown on profile</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          type="submit"
                          disabled={!phoneInput.trim()}
                          className="btn-primary-purple px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Save Phone Number</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Social Links Card */}
            <div className="p-6 rounded-2xl bg-[#0D1528] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Social Links & Profiles</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* LinkedIn */}
                <div className="space-y-1">
                  <label htmlFor="social-linkedin" className="block text-xs font-semibold text-slate-300">
                    LinkedIn URL
                  </label>
                  {isEditing ? (
                    <input
                      id="social-linkedin"
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                        }))
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono transition-colors"
                    />
                  ) : profile?.socialLinks?.linkedin ? (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80 text-xs text-purple-300 hover:text-white flex items-center justify-between group transition-colors"
                    >
                      <span className="font-mono truncate">{profile.socialLinks.linkedin}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0 ml-2" />
                    </a>
                  ) : (
                    <div className="text-xs text-slate-500 italic p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80">
                      Not linked
                    </div>
                  )}
                </div>

                {/* GitHub */}
                <div className="space-y-1">
                  <label htmlFor="social-github" className="block text-xs font-semibold text-slate-300">
                    GitHub URL
                  </label>
                  {isEditing ? (
                    <input
                      id="social-github"
                      type="url"
                      value={formData.socialLinks.github}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, github: e.target.value },
                        }))
                      }
                      placeholder="https://github.com/username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono transition-colors"
                    />
                  ) : profile?.socialLinks?.github ? (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80 text-xs text-purple-300 hover:text-white flex items-center justify-between group transition-colors"
                    >
                      <span className="font-mono truncate">{profile.socialLinks.github}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0 ml-2" />
                    </a>
                  ) : (
                    <div className="text-xs text-slate-500 italic p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80">
                      Not linked
                    </div>
                  )}
                </div>

                {/* LeetCode */}
                <div className="space-y-1">
                  <label htmlFor="social-leetcode" className="block text-xs font-semibold text-slate-300">
                    LeetCode URL
                  </label>
                  {isEditing ? (
                    <input
                      id="social-leetcode"
                      type="url"
                      value={formData.socialLinks.leetcode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, leetcode: e.target.value },
                        }))
                      }
                      placeholder="https://leetcode.com/u/username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono transition-colors"
                    />
                  ) : profile?.socialLinks?.leetcode ? (
                    <a
                      href={profile.socialLinks.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80 text-xs text-purple-300 hover:text-white flex items-center justify-between group transition-colors"
                    >
                      <span className="font-mono truncate">{profile.socialLinks.leetcode}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0 ml-2" />
                    </a>
                  ) : (
                    <div className="text-xs text-slate-500 italic p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80">
                      Not linked
                    </div>
                  )}
                </div>

                {/* Other Social Links */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Additional Portfolio & Links (Max 10)
                    </label>
                    {isEditing && formData.socialLinks.other.length < 10 && (
                      <button
                        type="button"
                        onClick={handleAddOtherLink}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Link</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      {formData.socialLinks.other.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic">
                          No additional links. Click "Add Link" above to add your portfolio or X.
                        </p>
                      ) : (
                        formData.socialLinks.other.map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={link.name}
                              onChange={(e) => handleUpdateOtherLink(idx, 'name', e.target.value)}
                              placeholder="Platform (e.g. Portfolio)"
                              className="w-1/3 px-3 py-2 rounded-xl bg-[#070B14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                            />
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => handleUpdateOtherLink(idx, 'url', e.target.value)}
                              placeholder="https://example.com"
                              className="flex-1 px-3 py-2 rounded-xl bg-[#070B14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveOtherLink(idx)}
                              className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(profile?.socialLinks?.other) &&
                      profile.socialLinks.other.length > 0 ? (
                        profile.socialLinks.other.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-[#070B14] border border-slate-800 text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors"
                          >
                            <span>{link.name || 'Link'}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No additional links added</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Skills and Technologies Card */}
            <div className="p-6 rounded-2xl bg-[#0D1528] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Skills & Technologies</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {isEditing ? formData.skills.length : profile?.skills?.length || 0} / 30
                </span>
              </div>

              {isEditing && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Add a technology or language (e.g. Next.js, GraphQL)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#070B14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill()}
                      className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold cursor-pointer transition-all"
                    >
                      Add
                    </button>
                  </div>

                  {/* Popular suggestions */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Quick Suggestions:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SKILLS.map((s) => {
                        const isAdded = formData.skills.some(
                          (existing) => existing.toLowerCase() === s.toLowerCase()
                        );
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => !isAdded && handleAddSkill(s)}
                            disabled={isAdded}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                              isAdded
                                ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                                : 'bg-[#070B14] hover:bg-purple-950/40 border border-slate-700 text-slate-300 hover:text-purple-300 hover:border-purple-500/30'
                            }`}
                          >
                            + {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Badges View */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(isEditing ? formData.skills : profile?.skills || []).length > 0 ? (
                  (isEditing ? formData.skills : profile.skills).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center gap-1.5 animate-fadeIn"
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-400 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No skills added yet. Click Edit Profile to showcase your programming languages and frameworks.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Competitive Statistics */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0D1528] border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Competitive Statistics</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">
                  Live Arena
                </span>
              </div>

              <div className="space-y-3">
                {/* Challenges Solved */}
                <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300 font-medium">Challenges Solved</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">
                    {profile?.challengesSolved || 0}
                  </span>
                </div>

                {/* Live Battles Won */}
                <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Swords className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-300 font-medium">Live Battles Won</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">
                    {profile?.battlesWon || 0}
                  </span>
                </div>

                {/* Battle Win Rate */}
                <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-300 font-medium">Battle Win Rate</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-amber-400">
                    {winRate}
                  </span>
                </div>

                {/* Total Points */}
                <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-slate-300 font-medium">Total Points</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-amber-300">
                    {profile?.points || 0}
                  </span>
                </div>

                {/* Global Rank */}
                <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-300 font-medium">Global Arena Rank</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">
                    {profile?.rank ? `#${profile.rank}` : 'Unranked'}
                  </span>
                </div>
              </div>

              {/* Informative server-controlled note */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 leading-relaxed">
                Competitive rank and points are dynamically earned through arena battle victories and verified challenge solves. They cannot be modified manually.
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Change Username */}
        {isUsernameModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0D1528] border border-purple-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-purple-400" />
                  <span>Change Username</span>
                </h3>
                <button
                  onClick={() => setIsUsernameModalOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
                ⚠️ <strong>30-Day Policy:</strong> You can only change your username once every 30 days. This will update your profile handle immediately.
              </div>

              <form onSubmit={handleSaveUsername} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="new-username-input" className="block text-xs font-medium text-slate-300">
                    New Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-mono text-xs">
                      @
                    </span>
                    <input
                      id="new-username-input"
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="new_username"
                      maxLength={24}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#070B14] border border-slate-700 text-white text-xs placeholder:text-slate-500 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    3-24 characters, letters, numbers, and underscores only.
                  </span>
                </div>

                {usernameError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{usernameError}</span>
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUsernameModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={usernameSaving || !newUsername.trim()}
                    className="btn-primary-purple px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {usernameSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Confirm & Change</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Phone Number Setup */}
        {isPhoneConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0D1528] border border-amber-500/40 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Confirm Phone Number</h3>
                  <p className="text-xs text-slate-400">Irreversible Action</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Phone Number:</span>
                  <span className="font-mono font-bold text-white">{phoneInput}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Visibility:</span>
                  <span className="capitalize font-semibold text-purple-300">
                    {phoneVisibilityInput}
                  </span>
                </div>
              </div>

              <p className="text-xs text-amber-200/90 leading-relaxed">
                Your phone number <strong>cannot be changed or removed</strong> after it is saved. Please verify that you entered the correct number.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPhoneConfirmOpen(false)}
                  disabled={phoneSaving}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSavePhone}
                  disabled={phoneSaving}
                  className="btn-primary-purple px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {phoneSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>I Confirm, Save Now</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Avatar Upload Preview */}
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0D1528] border border-purple-500/40 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Camera className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Upload Profile Picture</h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseAvatarModal}
                  disabled={avatarUploading}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Avatar Preview */}
              <div className="flex flex-col items-center justify-center gap-3 py-2">
                <div className="relative">
                  <img
                    src={avatarPreviewUrl}
                    alt="Avatar preview"
                    className="w-32 h-32 rounded-2xl object-cover border-2 border-purple-500 shadow-xl shadow-purple-950/50"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-[#070B14] border border-purple-500/40 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {selectedAvatarFile && (
                  <div className="text-center space-y-0.5">
                    <p className="text-xs font-medium text-slate-200 truncate max-w-xs">
                      {selectedAvatarFile.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {formatFileSize(selectedAvatarFile.size)} • {selectedAvatarFile.type.split('/')[1]?.toUpperCase()}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed">
                Cloudinary will automatically center your face, optimize format & quality, and crop this into a high-res square profile avatar.
              </div>

              {avatarError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{avatarError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors disabled:opacity-40"
                >
                  Choose Different
                </button>
                <button
                  type="button"
                  onClick={handleCloseAvatarModal}
                  disabled={avatarUploading}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAvatarUpload}
                  disabled={avatarUploading}
                  className="btn-primary-purple px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-purple-600/30"
                >
                  {avatarUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Confirm & Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Remove Avatar Confirmation */}
        {isRemoveAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-sm p-6 rounded-2xl bg-[#0D1528] border border-rose-500/30 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Reset Avatar</h3>
                  <p className="text-xs text-slate-400">Restore default robot icon</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to remove your custom profile picture? This will delete the image from Cloudinary and restore your default robot avatar.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRemoveAvatarModalOpen(false)}
                  disabled={avatarRemoving}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={avatarRemoving}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {avatarRemoving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Removing...</span>
                    </>
                  ) : (
                    <span>Yes, Reset Avatar</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
