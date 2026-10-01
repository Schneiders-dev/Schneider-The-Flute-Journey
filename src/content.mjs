// Raiz do conteúdo editável. O editor do administrador grava "sobrescritas" (caminho → valor)
// que o servidor aplica sobre estes objetos antes de renderizar a página.
import * as siteData from './data/site.mjs';
import { stationsFull } from './data/stations.mjs';
import { history, zones } from './data/journey.mjs';
import { pedagogues } from './data/pedagogues.mjs';
import { methods } from './data/methods.mjs';
import { repertoire } from './data/repertoire.mjs';
import * as practice from './data/practice.mjs';

export const content = {
  site: siteData.site,
  hero: siteData.hero,
  contact: siteData.contact,
  teacher: siteData.teacher,
  lessons: siteData.lessons,
  seminars: siteData.seminars,
  media: siteData.media,
  zones,
  stations: stationsFull,
  history,
  pedagogues,
  methods,
  repertoire,
  pillars: practice.pillars,
  problems: practice.problems,
  principles: practice.principles,
  routines: practice.routines,
  musicSteps: practice.musicSteps,
  tools: practice.tools,
  teacherPoints: practice.teacherPoints,
  philosophy: practice.philosophy,
  goals: practice.goals,
  checklist: practice.checklist,
  studyTechniques: practice.studyTechniques,
};

const pristine = structuredClone(content);

const SAFE_KEY = /^[A-Za-z0-9_-]+$/;
export function validPath(path) {
  const parts = String(path).split('.');
  if (!parts.length || parts.length > 8 || !parts.every((p) => SAFE_KEY.test(p)) || parts.some((p) => ['__proto__', 'prototype', 'constructor'].includes(p))) return false;
  return parts[0] in content;
}

function setPath(root, path, value) {
  const parts = path.split('.');
  let o = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (o[k] == null || typeof o[k] !== 'object') o[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    o = o[k];
  }
  o[parts[parts.length - 1]] = value;
}

export function getPath(path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), content);
}

/** Restaura o conteúdo original e aplica as sobrescritas (mutando os mesmos objetos). */
export function applyOverrides(overrides) {
  const fresh = structuredClone(pristine);
  for (const key of Object.keys(content)) {
    const target = content[key];
    const src = fresh[key];
    if (Array.isArray(target)) { target.length = 0; target.push(...src); }
    else { for (const k of Object.keys(target)) delete target[k]; Object.assign(target, src); }
  }
  for (const [path, value] of Object.entries(overrides)) if (validPath(path)) setPath(content, path, value);
}
