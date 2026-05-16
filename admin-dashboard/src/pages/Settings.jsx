// ─────────────────────────────────────────────
//  Page: Settings
//  Profile, Contact, Site, Notifications,
//  Security, Danger Zone
// ─────────────────────────────────────────────

import { useState } from 'react';
import { Save, User, Globe, Bell, Shield, AlertTriangle, Upload } from 'lucide-react';
import { Card, Button, Input, Textarea, Toggle, SectionHeader } from '../components/ui/index.jsx';

function SettingsSection({ icon: Icon, title, subtitle, children }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-500/10">
        <div className="w-9 h-9 bg-blue-500/15 ring-1 ring-blue-500/30 rounded-xl flex items-center justify-center">
          <Icon size={16} className="text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </Card>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: 'Elijah Enrique', email: 'elijahenrique8@gmail.com', phone: '0706 018 343', phone2: '0700 497 663', location: 'Kampala, Uganda', bio: 'CodeCanvas is a creative digital studio focused on graphic design, web development, and app development.' });
  const [site, setSite]       = useState({ siteName: 'CodeCanvas', tagline: 'Where Design Meets Code', whatsapp: 'https://wa.me/256706018343', instagram: 'https://instagram.com/codecanvas', tiktok: '', twitter: '' });
  const [notifs, setNotifs]   = useState({ newMessage: true, newTestimonial: true, projectUpdate: false, weeklyReport: true });
  const [saved, setSaved]     = useState(false);

  const setP = (key) => (e) => setProfile(p => ({ ...p, [key]: e.target.value }));
  const setS = (key) => (e) => setSite(s   => ({ ...s, [key]: e.target.value }));
  const setN = (key) => (val) => setNotifs(n => ({ ...n, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5 lg:p-7 space-y-6">

      <div className="flex items-center justify-between">
        <SectionHeader tag="⚙️ Config" title="Account" highlight="Settings" subtitle="Manage your profile and preferences" />
        <Button
          variant={saved ? 'success' : 'primary'}
          icon={Save}
          onClick={handleSave}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Profile ── */}
        <SettingsSection icon={User} title="Profile" subtitle="Your public-facing information">
          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
              EE
            </div>
            <div>
              <Button variant="outline" size="sm" icon={Upload}>Change Photo</Button>
              <p className="text-xs text-slate-600 mt-1.5">PNG or JPG, max 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name"  value={profile.name}     onChange={setP('name')} />
            <Input label="Email"      value={profile.email}    onChange={setP('email')} type="email" />
            <Input label="Phone 1"    value={profile.phone}    onChange={setP('phone')} />
            <Input label="Phone 2"    value={profile.phone2}   onChange={setP('phone2')} />
          </div>
          <Input label="Location" value={profile.location} onChange={setP('location')} />
          <Textarea label="Bio / About" value={profile.bio} onChange={setP('bio')} rows={3} />
        </SettingsSection>

        {/* ── Site Settings ── */}
        <SettingsSection icon={Globe} title="Website Settings" subtitle="Public site configuration">
          <Input label="Site Name" value={site.siteName} onChange={setS('siteName')} />
          <Input label="Tagline"   value={site.tagline}  onChange={setS('tagline')} />
          <div className="pt-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Social Media Links</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <Input placeholder="WhatsApp URL" value={site.whatsapp}   onChange={setS('whatsapp')}   className="flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <Input placeholder="Instagram URL" value={site.instagram} onChange={setS('instagram')} className="flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                </svg>
                <Input placeholder="TikTok URL"    value={site.tiktok}    onChange={setS('tiktok')}    className="flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <Input placeholder="X / Twitter URL" value={site.twitter} onChange={setS('twitter')}  className="flex-1" />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* ── Notifications ── */}
        <SettingsSection icon={Bell} title="Notifications" subtitle="Choose what alerts you receive">
          <div className="space-y-4">
            {[
              { key: 'newMessage',       label: 'New contact message',      sub: 'Email when someone submits the contact form'   },
              { key: 'newTestimonial',   label: 'New testimonial submitted', sub: 'Alert when a client leaves a review'           },
              { key: 'projectUpdate',    label: 'Project status updates',    sub: 'Notify on project milestone changes'           },
              { key: 'weeklyReport',     label: 'Weekly summary report',     sub: 'Receive a weekly analytics digest'             },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-slate-700/30 transition-colors">
                <div>
                  <div className="text-sm font-medium text-white">{n.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{n.sub}</div>
                </div>
                <Toggle checked={notifs[n.key]} onChange={setN(n.key)} />
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* ── Security ── */}
        <SettingsSection icon={Shield} title="Security" subtitle="Manage your account security">
          <div className="space-y-3">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password"     type="password" placeholder="••••••••" />
            <Input label="Confirm Password" type="password" placeholder="••••••••" />
          </div>
          <Button variant="outline" className="w-full justify-center mt-2">Update Password</Button>

          <div className="pt-4 border-t border-blue-500/10">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-700/20">
              <div>
                <div className="text-sm font-medium text-white">Two-Factor Auth</div>
                <div className="text-xs text-slate-500 mt-0.5">Extra layer of account security</div>
              </div>
              <Toggle checked={false} onChange={() => {}} />
            </div>
          </div>
        </SettingsSection>

      </div>

      {/* ── Danger Zone (full width) ── */}
      <Card className="p-6 border-red-500/20">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-red-500/10">
          <div className="w-9 h-9 bg-red-500/15 ring-1 ring-red-500/30 rounded-xl flex items-center justify-center">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-red-400 text-sm">Danger Zone</h3>
            <p className="text-xs text-slate-500 mt-0.5">Irreversible actions — proceed with caution</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="danger" className="flex-1 justify-center">Clear All Messages</Button>
          <Button variant="danger" className="flex-1 justify-center">Reset Portfolio Data</Button>
          <Button variant="danger" className="flex-1 justify-center">Delete Account</Button>
        </div>
      </Card>

    </div>
  );
}
