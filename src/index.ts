import { ExecutionService } from '@services/execution';
import { PipelineStateService } from '@services/pipeline-state';
import { CurrentRouteComponent } from '@widgets/current-route';
import { FooterComponent } from '@widgets/footer';
import { HeaderComponent } from '@widgets/header';
import { IconComponent } from '@widgets/icon';
import { PipelineComponent } from '@widgets/pipeline';
import { TileComponent } from '@widgets/tile';
import { Application } from './application';

new Application()
  .applyGlobalStyles()
  .bootstrapBackgroundServices([ExecutionService, PipelineStateService])
  .registerComponents([
    IconComponent,
    HeaderComponent,
    FooterComponent,
    TileComponent,
    PipelineComponent,
    CurrentRouteComponent

    // RouteAnalysisComponent,
    // RouteCodeComponent,
    // RouteMinificationComponent,
    // RouteTranspilationComponent
  ]);
