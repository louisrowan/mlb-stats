// #include <node.h>
// #include <iostream>
// #include <fstream>

// namespace demo {

// using v8::FunctionCallbackInfo;
// using v8::Isolate;
// using v8::Local;
// using v8::Object;
// using v8::String;
// using v8::Value;


// void Method(const FunctionCallbackInfo<Value>& args) {
//   Isolate* isolate = args.GetIsolate();

//     // get the param
//     v8::String::Utf8Value param1(args[0]->ToString());

//     // convert it to string
//     std::string foo = std::string(*param1);    


//   std::cout << "num is " << foo << std::endl;

//   args.GetReturnValue().Set(String::NewFromUtf8(isolate, "hello from cpp land"));
// }

// void init(Local<Object> exports) {
//   NODE_SET_METHOD(exports, "hello", Method);
// }

// NODE_MODULE(NODE_GYP_MODULE_NAME, init)

// }

// come back to this later