import { Application } from './application';
import { PipelineComponent } from './components/pipeline/component';
import { TileComponent } from './components/tile/component';

new Application().applyGlobalStyles().registerComponents([TileComponent, PipelineComponent]);

window.addEventListener('hashchange', ({ newURL }: HashChangeEvent) => {
  const targetHash: string = new URL(newURL).hash;
  // eslint-disable-next-line no-console
  console.log(targetHash);
});
