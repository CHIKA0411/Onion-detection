import React, { useState } from 'react';
import { Search, CheckCircle2, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import type { Language } from '../types';

interface LanguageScreenProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onConfirm: () => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const englishLang = LANGUAGES.find((l) => l.id === 'en') || LANGUAGES[0];
  const constitutionalLangs = LANGUAGES.filter((l) => l.isConstitutional);

  const filteredConstitutional = constitutionalLangs.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.script.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const playGreetingAudio = (lang: Language, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingAudio(lang.id);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.sampleGreeting);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setPlayingAudio(null);
    }, 2500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-linen)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
    }} className="animate-fade-in">
      <div style={{
        maxWidth: '780px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        {/* Emblem & Ministry Header */}
        <div style={{ textTransform: 'uppercase', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--accent-leaf-green)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '0.75rem',
            padding: '4px',
            overflow: 'hidden',
          }}>
            <img src="/emblem.png" alt="National Emblem of India" style={{ height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(74, 59, 50, 0.08)',
            padding: '0.25rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-earth-brown)',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
          }}>
            <ShieldCheck size={14} color="var(--accent-leaf-green)" />
            MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
          </div>
          <h1 style={{ fontSize: '1.55rem', color: 'var(--text-earth-dark)', marginBottom: '0.25rem' }}>
            Select Procurement Staff Interface Language
          </h1>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--accent-terracotta)', fontWeight: 500 }}>
            अपनी भाषा चुनें / Choose your native language
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-earth-light)', marginTop: '0.35rem' }}>
            Supports all 22 Eighth Schedule Constitutional Languages of India + English (SIH26031)
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={19} color="var(--text-earth-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search language by name, native script, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.8rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-strong)',
              backgroundColor: 'var(--surface-white)',
              color: 'var(--text-earth-dark)',
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>

        {/* Top Option: English */}
        {!searchQuery && (
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-earth-light)', marginBottom: '0.5rem', display: 'block' }}>
              System / Default Language (प्राथमिक भाषा)
            </span>
            <div
              onClick={() => onSelectLanguage(englishLang)}
              style={{
                backgroundColor: selectedLanguage.id === 'en' ? 'var(--accent-leaf-light)' : 'var(--surface-white)',
                border: selectedLanguage.id === 'en' ? '2.5px solid var(--accent-leaf-green)' : '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: selectedLanguage.id === 'en' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-linen)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'var(--text-earth-brown)',
                  fontSize: '1rem',
                }}>
                  EN
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-earth-dark)' }}>
                    English
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-earth-light)' }}>
                    Master Administrative Language
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={(e) => playGreetingAudio(englishLang, e)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--text-earth-brown)',
                    fontSize: '0.78rem',
                  }}
                  title="Listen Sample Audio"
                >
                  <Volume2 size={15} color={playingAudio === 'en' ? 'var(--accent-leaf-green)' : 'var(--text-earth-light)'} />
                  <span>Listen</span>
                </button>

                {selectedLanguage.id === 'en' && (
                  <CheckCircle2 size={24} color="var(--accent-leaf-green)" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* 22 Eighth Schedule Constitutional Languages List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-earth-light)' }}>
              22 Eighth Schedule Constitutional Languages (संविधान की 22 भाषाएं)
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-leaf-green)', fontWeight: 600 }}>
              {filteredConstitutional.length} Languages
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0.85rem',
          }}>
            {filteredConstitutional.map((lang) => {
              const isSelected = selectedLanguage.id === lang.id;
              return (
                <div
                  key={lang.id}
                  onClick={() => onSelectLanguage(lang)}
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-leaf-light)' : 'var(--surface-white)',
                    border: isSelected ? '2px solid var(--accent-leaf-green)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--text-earth-dark)',
                      margin: 0,
                      lineHeight: 1.2,
                    }}>
                      {lang.nativeName}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-earth-light)', display: 'block', marginTop: '0.15rem' }}>
                      {lang.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={(e) => playGreetingAudio(lang, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.25rem',
                        color: playingAudio === lang.id ? 'var(--accent-leaf-green)' : 'var(--text-earth-light)',
                      }}
                      title="Audio Sample"
                    >
                      <Volume2 size={16} />
                    </button>
                    {isSelected && <CheckCircle2 size={20} color="var(--accent-leaf-green)" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Floating Action Bar with Leaf Green "Continue" Button */}
        <div style={{
          position: 'sticky',
          bottom: '1rem',
          backgroundColor: 'var(--surface-white)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-earth-light)', display: 'block' }}>
              Selected Interface Language:
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-earth-dark)' }}>
              {selectedLanguage.nativeName} ({selectedLanguage.name})
            </span>
          </div>

          <button
            onClick={onConfirm}
            className="btn-leaf-green pulse-green"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span>Proceed to Inspection System</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
