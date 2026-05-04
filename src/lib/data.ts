import { supabase } from './supabase';

export interface Unidad {
  id: number;
  titulo: string;
  descripcion: string;
  color: string;
  semanas?: Semana[];
}

export interface Semana {
  id: number;
  unidad_id: number;
  numero_semana: number;
  titulo: string;
  descripcion: string;
  video_url?: string;
  contenido?: string;
  archivos?: Archivo[];
  created_at?: string;
}

export interface Archivo {
  id: number;
  semana_id: number;
  nombre: string;
  tipo: string;
  url: string;
  created_at?: string;
}

export async function getUnidades(): Promise<Unidad[]> {
  const { data: unidades, error } = await supabase
    .from('unidades')
    .select('*')
    .order('id');
  
  if (error) throw error;
  
  const { data: semanas } = await supabase
    .from('semanas')
    .select('*')
    .order('numero_semana');
  
  return (unidades || []).map(u => ({
    ...u,
    semanas: (semanas || []).filter(s => s.unidad_id === u.id)
  }));
}

export async function getUnidadById(id: number): Promise<Unidad | null> {
  const { data: unidad, error } = await supabase
    .from('unidades')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !unidad) return null;
  
  const { data: semanas } = await supabase
    .from('semanas')
    .select('*')
    .eq('unidad_id', id)
    .order('numero_semana');
  
  return { ...unidad, semanas: semanas || [] };
}

export async function getSemanaById(semanaId: number): Promise<Semana | null> {
  const { data: semana, error } = await supabase
    .from('semanas')
    .select('*')
    .eq('id', semanaId)
    .single();
  
  if (error || !semana) return null;
  
  const { data: archivos } = await supabase
    .from('archivos')
    .select('*')
    .eq('semana_id', semanaId);
  
  return { ...semana, archivos: archivos || [] };
}

export async function getSemanaByNumero(unidadId: number, numero: number): Promise<Semana | null> {
  const { data: semana, error } = await supabase
    .from('semanas')
    .select('*')
    .eq('unidad_id', unidadId)
    .eq('numero_semana', numero)
    .single();
  
  if (error || !semana) return null;
  
  const { data: archivos } = await supabase
    .from('archivos')
    .select('*')
    .eq('semana_id', semana.id);
  
  return { ...semana, archivos: archivos || [] };
}

export async function createUnidad(unidad: Omit<Unidad, 'id'>): Promise<Unidad> {
  const { data, error } = await supabase
    .from('unidades')
    .insert(unidad)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUnidad(id: number, unidad: Partial<Unidad>): Promise<Unidad> {
  const { data, error } = await supabase
    .from('unidades')
    .update(unidad)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteUnidad(id: number): Promise<void> {
  const { error } = await supabase
    .from('unidades')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function createSemana(semana: Omit<Semana, 'id'>): Promise<Semana> {
  const { data, error } = await supabase
    .from('semanas')
    .insert(semana)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSemana(id: number, semana: Partial<Semana>): Promise<Semana> {
  const { data, error } = await supabase
    .from('semanas')
    .update(semana)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteSemana(id: number): Promise<void> {
  const { error } = await supabase
    .from('semanas')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function createArchivo(archivo: Omit<Archivo, 'id'>): Promise<Archivo> {
  const { data, error } = await supabase
    .from('archivos')
    .insert(archivo)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteArchivo(id: number): Promise<void> {
  const { error } = await supabase
    .from('archivos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export interface Perfil {
  id: number;
  nombre: string;
  bio: string;
  ubicacion: string;
  email: string;
  telefono: string;
  github: string;
  linkedin: string;
  imagen?: string;
}

export interface Habilidad {
  id: number;
  categoria: string;
  items: string[];
  orden: number;
}

export interface Educacion {
  id: number;
  titulo: string;
  institucion: string;
  periodo: string;
  descripcion: string;
  orden: number;
}

export interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  tecnologias: string[];
  enlace: string;
  orden: number;
}

export async function getPerfil(): Promise<Perfil | null> {
  const { data, error } = await supabase
    .from('perfil')
    .select('*')
    .single();
  
  if (error || !data) return null;
  return data;
}

export async function updatePerfil(id: number, perfil: Partial<Perfil>): Promise<Perfil> {
  const { data, error } = await supabase
    .from('perfil')
    .update(perfil)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getHabilidades(): Promise<Habilidad[]> {
  const { data, error } = await supabase
    .from('habilidades')
    .select('*')
    .order('orden');
  
  if (error) throw error;
  return data || [];
}

export async function updateHabilidad(id: number, habilidad: Partial<Habilidad>): Promise<Habilidad> {
  const { data, error } = await supabase
    .from('habilidades')
    .update(habilidad)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getEducacion(): Promise<Educacion[]> {
  const { data, error } = await supabase
    .from('educacion')
    .select('*')
    .order('orden');
  
  if (error) throw error;
  return data || [];
}

export async function updateEducacion(id: number, educacion: Partial<Educacion>): Promise<Educacion> {
  const { data, error } = await supabase
    .from('educacion')
    .update(educacion)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getProyectos(): Promise<Proyecto[]> {
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .order('orden');
  
  if (error) throw error;
  return data || [];
}

export async function updateProyecto(id: number, proyecto: Partial<Proyecto>): Promise<Proyecto> {
  const { data, error } = await supabase
    .from('proyectos')
    .update(proyecto)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  imagen: string;
}

export async function getNoticias(): Promise<Noticia[]> {
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .order('fecha', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createNoticia(noticia: Omit<Noticia, 'id'>): Promise<Noticia> {
  const { data, error } = await supabase
    .from('noticias')
    .insert(noticia)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateNoticia(id: number, noticia: Partial<Noticia>): Promise<Noticia> {
  const { data, error } = await supabase
    .from('noticias')
    .update(noticia)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteNoticia(id: number): Promise<void> {
  const { error } = await supabase
    .from('noticias')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export interface Juego {
  id: number;
  titulo: string;
  descripcion: string;
  genero: string;
  imagen: string;
  archivo: string;
  tipo: string;
  orden: number;
}

export async function getJuegos(): Promise<Juego[]> {
  const { data, error } = await supabase
    .from('juegos')
    .select('*');
  
  if (error) throw error;
  return data || [];
}

export async function createJuego(juego: Omit<Juego, 'id'>): Promise<Juego> {
  const { data, error } = await supabase
    .from('juegos')
    .insert(juego)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateJuego(id: number, juego: Partial<Juego>): Promise<Juego> {
  const { data, error } = await supabase
    .from('juegos')
    .update(juego)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteJuego(id: number): Promise<void> {
  const { error } = await supabase
    .from('juegos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export interface Musica {
  id: number;
  titulo: string;
  artista: string;
  album: string;
  duracion: string;
  genero: string;
  imagen: string;
  url: string;
  orden: number;
}

export async function getMusica(): Promise<Musica[]> {
  const { data, error } = await supabase
    .from('musica')
    .select('*');
  
  if (error) throw error;
  return data || [];
}

export async function createMusica(musica: Omit<Musica, 'id'>): Promise<Musica> {
  const { data, error } = await supabase
    .from('musica')
    .insert(musica)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateMusica(id: number, musica: Partial<Musica>): Promise<Musica> {
  const { data, error } = await supabase
    .from('musica')
    .update(musica)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteMusica(id: number): Promise<void> {
  const { error } = await supabase
    .from('musica')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteHabilidad(id: number): Promise<void> {
  const { error } = await supabase
    .from('habilidades')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteEducacion(id: number): Promise<void> {
  const { error } = await supabase
    .from('educacion')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteProyecto(id: number): Promise<void> {
  const { error } = await supabase
    .from('proyectos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}