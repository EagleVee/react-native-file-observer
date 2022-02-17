//
//  FileObserver.m
//  nativeexample
//
//  Created by sondhoang on 15/02/2022.
//

#import <Foundation/Foundation.h>



// VideoPlayer.m
#import "FileObserverModule.h"



@implementation FileObserverModule
{
  BOOL _hasListeners;
}

- (instancetype)init {
  if (self = [super init]) {
    // Initialize self
    // Create the test file URL
  }
  return self;
}

- (void)fileMonitor:(TABFileMonitor *)fileMonitor didSeeChange:(TABFileMonitorChangeType)changeType
{
  if (changeType == TABFileMonitorChangeTypeMetadata)
  {
    [self onChange:@"TABFileMonitorChangeTypeMetadata"];
  }
  else if (changeType == TABFileMonitorChangeTypeDeleted)
  {
    [self onChange:@"TABFileMonitorChangeTypeDeleted"];
  }
  else if (changeType == TABFileMonitorChangeTypeSize)
  {
    //[self onChange:@"TABFileMonitorChangeTypeSize"];
  }
  else if (changeType == TABFileMonitorChangeTypeObjectLink)
  {
    [self onChange:@"TABFileMonitorChangeTypeObjectLink"];
  }
  else if (changeType == TABFileMonitorChangeTypeRenamed)
  {
    [self onChange:@"TABFileMonitorChangeTypeRenamed"];
  }
  else if (changeType == TABFileMonitorChangeTypeRevoked)
  {
    [self onChange:@"TABFileMonitorChangeTypeRevoked"];
  }
  else if (changeType == TABFileMonitorChangeTypeModified)
  {
    [self onChange:@"TABFileMonitorChangeTypeModified"];
  }
}

RCT_REMAP_METHOD(initWatchFile,
                 filePath:(NSString *)path
                 eventChange:(NSString *)event
                 initWatchFileResolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

{
  _testFileURL = [[NSURL alloc] initFileURLWithPath:path];
  
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if (![fileManager fileExistsAtPath:path]) {
    NSData *data = [@"" dataUsingEncoding:NSUTF8StringEncoding];
    [data writeToFile:path atomically:YES];
  }
  eventChange = event;
  TABFileMonitor *fileMonitor = [[TABFileMonitor alloc] initWithURL:_testFileURL];
  fileMonitor.delegate = self;
}

RCT_REMAP_METHOD(clearFileToEmptyObject,
                 filePath:(NSString *)path
                 clearFileResolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

{
  NSData *data = [@"" dataUsingEncoding:NSUTF8StringEncoding];
  [data writeToFile:path atomically:YES];
}

+ (BOOL)requiresMainQueueSetup{
  return NO;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[eventChange];
}

// Will be called when this module's first listener is added.
- (void)startObserving
{
  _hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving
{
  _hasListeners = NO;
}

- (void)onChange:(NSString *)event
{
  NSError *error;
  NSString *fileContents = [NSString stringWithContentsOfFile:self->_testFileURL encoding:NSUTF8StringEncoding error:&error];
  
  if (_hasListeners) {
    [self sendEventWithName:eventChange body:[NSString stringWithFormat:@"%@",fileContents]];
  }
}

@end
