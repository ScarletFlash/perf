import { Application } from './application';
import { CurrentRouteComponent } from './components/current-route/component';
import { HeaderComponent } from './components/header/component';
import { PipelineComponent } from './components/pipeline/component';
import { RouteAnalysisComponent } from './components/route-analysis/component';
import { RouteCodeComponent } from './components/route-code/component';
import { RouteMinificationComponent } from './components/route-minification/component';
import { RouteTranspilationComponent } from './components/route-transpilation/component';
import { TileComponent } from './components/tile/component';

new Application()
  .applyGlobalStyles()
  .registerComponents([
    HeaderComponent,
    TileComponent,
    PipelineComponent,
    CurrentRouteComponent,
    RouteAnalysisComponent,
    RouteCodeComponent,
    RouteMinificationComponent,
    RouteTranspilationComponent
  ]);
