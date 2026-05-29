import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:trash_smart_app/ui/pages/root.view.dart';

import 'blocs/bloc_themes/theme.bloc.dart';


// This is the entry point of the application
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of the application.
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
        providers: [
          BlocProvider(create: (context)=>ThemeBloc()),
        ],
        child: const RootView()
    );
  }


}







