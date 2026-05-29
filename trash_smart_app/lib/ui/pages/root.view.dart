import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:trash_smart_app/ui/pages/trash.page.dart';
import 'package:trash_smart_app/ui/pages/trashcan.page.dart';
import 'package:trash_smart_app/ui/pages/users.page.dart';

import '../../blocs/bloc_themes/theme.bloc.dart';
import '../../blocs/bloc_themes/theme.state.dart';
import 'home.page.dart';

class RootView extends StatelessWidget {
  const RootView({Key? key}) : super(key: key);

  //the roots of the pages.
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeBloc, ThemeState>(
        builder: (context, state)
    {
      return MaterialApp(
        theme: state.themeData,
        routes: {
          "/": (context) => const HomePage(),
          "/users": (context) => const UsersPage(),
          "/trashcan": (context) => const TrashCanPage(),
          "/trash": (context) => const TrashPage(),
        },
        initialRoute: "/",
      );
    }
    );
  }

}
