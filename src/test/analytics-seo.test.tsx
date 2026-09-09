import { render, cleanup } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Seo from '../components/Seo';
import Analytics, { trackPageView } from '../components/Analytics';

afterEach(() => {cleanup();vi.unstubAllGlobals();});
it('uses each route cover, one schema and a normalized canonical', () => {
 const view=render(<Seo title="Serviços Código5" description="Nossos serviços" path="/servicos/" />);
 expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://codigo5.com.br/assets/codigo5/social/servicos.jpg');
 expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://codigo5.com.br/servicos');
 expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1200');
 view.rerender(<Seo title="Artigo" description="Descrição" path="/blog/exemplo" type="article" image="https://images.example/artigo.webp" />);
 expect(document.querySelectorAll('#codigo5-schema')).toHaveLength(1);
 expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://images.example/artigo.webp');
 expect(document.querySelector('meta[property="og:image:width"]')).toBeNull();
});
it('sends one page view per route to the verified GA4 destination without query data', () => {
 const gtag=vi.fn();
 vi.stubGlobal('window',{location:{hostname:'codigo5.com.br',origin:'https://codigo5.com.br',pathname:'/servicos'},gtag});
 trackPageView('Serviços','/servicos');trackPageView('Serviços','/servicos');trackPageView('Contato','/contato');
 expect(gtag).toHaveBeenCalledTimes(2);
 expect(gtag).toHaveBeenLastCalledWith('event','page_view',{page_title:'Contato',page_location:'https://codigo5.com.br/contato',page_path:'/contato',send_to:'G-4M9KM8258K'});
});
it('does not send local or private page views', () => {
 const gtag=vi.fn();
 vi.stubGlobal('window',{location:{hostname:'localhost',pathname:'/'},gtag});trackPageView('Local','/');
 vi.stubGlobal('window',{location:{hostname:'codigo5.com.br',pathname:'/admin/editorial'},gtag});trackPageView('Admin','/admin/editorial');
 expect(gtag).not.toHaveBeenCalled();
});
it('installs and removes the contact click listener',()=>{
 const add=vi.spyOn(document,'addEventListener');const remove=vi.spyOn(document,'removeEventListener');
 const view=render(<Analytics/>);view.unmount();
 const listener=add.mock.calls.find(([type])=>type==='click')?.[1];
 expect(listener).toBeTypeOf('function');expect(remove).toHaveBeenCalledWith('click',listener);
});
