import { Application } from './application';
import { TileComponent } from './components/tile/component';

new Application().applyGlobalStyles().registerComponents([TileComponent]);

window.addEventListener('hashchange', ({ newURL }: HashChangeEvent) => {
  const targetHash: string = new URL(newURL).hash;
  // eslint-disable-next-line no-console
  console.log(targetHash);
});
