import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConfigModule, provideConfig } from '@spartacus/core';
import { CmsLibModule } from '../cms-components/cms-lib.module';
import { provideConfigFromMetaTags } from '../config/provide-config-from-meta-tags';
import { LayoutModule } from '../layout';
import { StorefrontConfig } from '../storefront-config';
import { StorefrontModule } from '../storefront.module';
import { b2cLayoutConfig } from './config/b2c-layout-config';
import { defaultCmsContentConfig } from './config/static-cms-structure/default-cms-content.config';

@NgModule({
  imports: [
    StorefrontModule.withConfig(<StorefrontConfig>{
      pwa: {
        enabled: true,
        addToHomeScreen: true,
      },
    }),

    CmsLibModule,
    ConfigModule.withConfig(b2cLayoutConfig),
    ConfigModule.withConfigFactory(defaultCmsContentConfig),
  ],
  exports: [LayoutModule],
})
export class B2cStorefrontModule {
  static withConfig(config?: StorefrontConfig): ModuleWithProviders {
    return {
      ngModule: B2cStorefrontModule,
      providers: [provideConfig(config), ...provideConfigFromMetaTags()],
    };
  }
}
