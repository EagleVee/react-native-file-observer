//
//  FileObserver.h
//  nativeexample
//
//  Created by sondhoang on 15/02/2022.
//

#ifndef FileObserver_h
#define FileObserver_h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "TABFileMonitor.h"
#import <React/RCTUIManager.h>


@interface FileObserverModule : RCTEventEmitter <TABFileMonitorDelegate, RCTBridgeModule>
{
  NSURL *_testFileURL;
  NSString* eventChange;
}
@end


#endif /* FileObserver_h */
