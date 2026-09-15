import { render, cleanup } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Seo from '../components/Seo';
import Analytics from '../components/Analytics';

afterEach(() => {cleanup();vi.unstubAllGlobals();});
it('uses each route cover, one schema and a normalized canonical', () => {
 const view=render(<Seo title="Serviços Código5" description="Nossos serviços" path="/servicos/" />);
 expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://codigo5.com.br/assets/codigo5/social/servicos.jpg');
 expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://codigo5.com.br/servicos');
 expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1200');
 view.rerender(<Seo title="Artigo" description="Descrição" path="/blog/exemplo" type="article" image="https://images.example/artigo.webp" />);
 expect(document.querySelectorAll('#codigo5-schema')).toHaveLength(1);
 expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://images.example/artigo.webp');
 expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1200');
});
it('keeps server image metadata after article hydration', () => {
 document.head.insertAdjacentHTML('beforeend','<meta property="og:image:width" content="1536" /><meta property="og:image:height" content="1024" /><meta property="og:image:type" content="image/jpeg" />');
 render(<Seo title="Artigo" description="Descrição" path="/blog/exemplo" type="article" image="https://cdn-codigo5.sfo2.digitaloceanspaces.com/sync/capa.jpg" imageMeta={{width:1536,height:1024,mime:'image/jpeg',alt:'Capa'}} />);
 expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1536');
 expect(document.querySelector('meta[property="og:image:height"]')?.getAttribute('content')).toBe('1024');
 expect(document.querySelector('meta[property="og:image:type"]')?.getAttribute('content')).toBe('image/jpeg');
});
it('installs and removes the contact click listener',()=>{
 const add=vi.spyOn(document,'addEventListener');const remove=vi.spyOn(document,'removeEventListener');
 const view=render(<Analytics/>);view.unmount();
 const listener=add.mock.calls.find(([type])=>type==='click')?.[1];
 expect(listener).toBeTypeOf('function');expect(remove).toHaveBeenCalledWith('click',listener);
});
it('records contact method without sending the address or message',()=>{
 const add=vi.spyOn(document,'addEventListener');const view=render(<Analytics/>);
 const listener=add.mock.calls.find(([type])=>type==='click')?.[1] as EventListener;
 const anchor=document.createElement('a');anchor.href='https://wa.me/5565999822022?text=mensagem';
 const event=new MouseEvent('click');Object.defineProperty(event,'target',{value:anchor});
 const gtag=vi.fn();vi.stubGlobal('window',{location:{hostname:'codigo5.com.br',pathname:'/servicos'},gtag});
 listener(event);
 expect(gtag).toHaveBeenCalledWith('event','contact_click',{contact_method:'whatsapp',page_path:'/servicos',send_to:'G-4M9KM8258K'});
 vi.unstubAllGlobals();view.unmount();
});
