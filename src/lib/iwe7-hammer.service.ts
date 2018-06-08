import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { InjectionToken, Optional, Inject, Provider, NgModule } from '@angular/core';
import { HammerInstance, HammerOptions, HammerStatic, Recognizer, RecognizerStatic } from './gesture-annotations';
export const HAMMER_OPTIONS = new InjectionToken<HammerOptions>('HAMMER_OPTIONS');
// 默认全开启
export class Iwe7HammerGestureConfig extends HammerGestureConfig {
  private _hammer: HammerStatic = typeof window !== 'undefined' ? (window as any).Hammer : null;
  // 原生
  events: string[] = [
    'longpress',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft',
  ];
  constructor(
    @Optional()
    @Inject(HAMMER_OPTIONS)
    public _hammerOptions: HammerOptions
  ) {
    super();
  }
  buildHammer(element: HTMLElement): HammerInstance {
    const mc = new this._hammer(element, this._hammerOptions as any || undefined);
    const pan = new this._hammer.Pan();
    const swipe = new this._hammer.Swipe();
    const press = new this._hammer.Press();
    const slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
    const longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
    pan.recognizeWith(swipe);
    // 添加 swiper press pan slide longpress
    mc.add([swipe, press, pan, slide, longpress]);
    return mc as HammerInstance;
  }

  private _createRecognizer(base: Recognizer, options: any, ...inheritances: Recognizer[]): Recognizer {
    let recognizer = new (base.constructor as RecognizerStatic)(options);
    inheritances.push(base);
    // 同时识别
    inheritances.forEach(item => recognizer.recognizeWith(item as any));
    return recognizer as any;
  }
}

const hammerOptions: HammerOptions = {
  cssProps: {
    touchCallout: 'none',
    touchSelect: 'none',
    userDrag: 'none',
    userSelect: 'none',
    tapHighlightColor: 'red',
    contentZooming: 'none'
  }
};

export const Iwe7HammerOptionsProvider: Provider = [
  {
    provide: HAMMER_OPTIONS,
    useValue: hammerOptions
  }
];

export const Iwe7HammerConfigProvider: Provider = [
  {
    provide: HAMMER_GESTURE_CONFIG,
    useClass: Iwe7HammerGestureConfig,
    deps: [HAMMER_OPTIONS]
  }
];

export const Iwe7HammerProvider: Provider = [
  Iwe7HammerOptionsProvider,
  Iwe7HammerConfigProvider
];

@NgModule({
  providers: [Iwe7HammerProvider]
})
export class Iwe7HammerModule {

}
