import { toast } from "sonner";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
console.log('API BASE:', import.meta.env.VITE_API_BASE_URL);

export async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE}/api/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error('Failed to fetch projects. Using local data instead.');
    return [];
  }
}

export async function sendMessage(messageData: { name: string; email: string; message: string }) {
  try {
    const response = await fetch(`${API_BASE}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function fetchMessages() {
  try {
    const response = await fetch(`${API_BASE}/api/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Failed to fetch messages');
    return [];
  }
}

export async function sendContactMessage(contactData: { 
  name: string; 
  email: string; 
  subject?: string; 
  message: string 
}) {
  try {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send contact message');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
}

export async function fetchHero() {
  try {
    const response = await fetch(`${API_BASE}/api/hero/hero.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch hero');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching hero:', error);
    return null;
  }
}

export async function fetchAbout() {
  try {
    const response = await fetch(`${API_BASE}/api/about/about.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch about');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching about:', error);
    return null;
  }
}

export async function fetchProjectsDynamic() {
  try {
    const response = await fetch(`${API_BASE}/api/projects/projects.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function fetchSkills() {
  try {
    const response = await fetch(`${API_BASE}/api/skills/skills.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch skills');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function fetchContact() {
  try {
    const response = await fetch(`${API_BASE}/api/contact/contact.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch contact');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    return null;
  }
}

export async function saveContact(contactData: {
  location: string;
  email: string;
  phone: string;
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}) {
  try {
    const response = await fetch(`${API_BASE}/api/contact/update.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    if (!response.ok) throw new Error('Failed to save contact');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
}

export async function saveHero(heroData: {
  name: string;
  tagline: string;
  socialLinks: Array<{ name: string; url: string; icon: string; }>;
}) {
  const response = await fetch(`${API_BASE}/api/hero/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(heroData),
  });
  if (!response.ok) throw new Error('Failed to save hero');
  return response.json();
}

export async function saveAbout(formData: FormData) {
  const response = await fetch(`${API_BASE}/api/about/update.php`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to save about');
  return response.json();
}

// File management APIs
export async function listUploads() {
  const res = await fetch(`${API_BASE}/api/upload/list.php`);
  if (!res.ok) throw new Error('Failed to list files');
  return res.json();
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE}/api/upload/upload.php`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function deleteFile(filename: string) {
  const res = await fetch(`${API_BASE}/api/upload/delete.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });
  return res.json();
}

export async function renameFile(oldName: string, newName: string) {
  const res = await fetch(`${API_BASE}/api/upload/rename.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName }),
  });
  return res.json();
}

export async function createSkill(skill: { title: string; icon: string; skills: string[] }) {
  const res = await fetch(`${API_BASE}/api/skills/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', ...skill }),
  });
  return res.json();
}

export async function updateSkillAPI(id: number, skill: { title: string; icon: string; skills: string[] }) {
  const res = await fetch(`${API_BASE}/api/skills/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', id, ...skill }),
  });
  return res.json();
}

export async function deleteSkill(id: number) {
  const res = await fetch(`${API_BASE}/api/skills/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id }),
  });
  return res.json();
}

export async function createProject(project: { title: string; description: string; image: string; tags: string[]; demoLink: string; codeLink: string; category: string }) {
  const res = await fetch(`${API_BASE}/api/projects/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', ...project }),
  });
  return res.json();
}

export async function updateProjectAPI(id: number, project: { title: string; description: string; image: string; tags: string[]; demoLink: string; codeLink: string; category: string }) {
  const res = await fetch(`${API_BASE}/api/projects/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', id, ...project }),
  });
  return res.json();
}

export async function deleteProject(id: number) {
  const res = await fetch(`${API_BASE}/api/projects/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id }),
  });
  return res.json();
}

export async function listUploadedFiles() {
  const res = await fetch(`${API_BASE}/api/upload/list.php`);
  if (!res.ok) throw new Error('Failed to list files');
  return res.json();
}

export async function getInstallScan() {
  const response = await fetch(`${API_BASE}/api/install/install.php`);
  return response.json();
}

export async function installDatabase() {
  const response = await fetch(`${API_BASE}/api/install/install.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'install-db' })
  });
  return response.json();
}

export async function createAdmin({ email, password }: { email: string; password: string; }) {
  const response = await fetch(`${API_BASE}/api/admin/create_admin.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

export async function checkInstallStatus() {
  const response = await fetch(`${API_BASE}/api/status/status.php`);
  return response.json();
}

export async function checkAuth() {
  const response = await fetch(`${API_BASE}/api/auth/auth.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  return response.json();
}

export async function loginRequest(email, password) {
  const response = await fetch(`${API_BASE}/api/auth/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  });
  return response.json();
}

export async function logoutRequest() {
  const response = await fetch(`${API_BASE}/api/auth/logout.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  return response.json();
}

export async function updateSettingsRequest(email, currentPassword, newPassword) {
  const response = await fetch(`${API_BASE}/api/settings.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, currentPassword, newPassword }),
    credentials: 'include'
  });
  return response.json();
}

export async function saveSiteSettings(values: any) {
  const response = await fetch(`${API_BASE}/api/site/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  return response.json();
}

export async function saveSmtpSettings(values: any) {
  const response = await fetch(`${API_BASE}/api/smtp/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  return response.json();
}

export async function getSiteSettings() {
  const response = await fetch(`${API_BASE}/api/site/settings.php`);
  return response.json();
}

export async function fetchMessagesAPI() {
  const response = await fetch(`${API_BASE}/api/messages`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  return response.json();
}

export async function fetchResumeFile() {
  const response = await fetch(`${API_BASE}/api/resume/index.php`);
  return response;
}

export async function fetchSiteSettings() {
  const response = await fetch(`${API_BASE}/api/site/settings.php`);
  return response.json();
}

export async function fetchSmtpSettings() {
  const response = await fetch(`${API_BASE}/api/smtp/settings.php`);
  return response.json();
}

export async function updateSiteUrl(site_url: string) {
  const response = await fetch(`${API_BASE}/api/site/update.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ site_url })
  });
  return response.json();
}

export async function fetchDatabaseStatus() {
  try {
    const response = await fetch(`${API_BASE}/api/status/status.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch database status');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching database status:', error);
    return null;
  }
}
