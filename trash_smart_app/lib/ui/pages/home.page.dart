import 'package:flutter/material.dart';

import '../widgets/main.drawer.widget.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  // Page type Scaffold
  @override
  Widget  build(BuildContext context) {
    return Scaffold(
      drawer: const MainDrawer(),
      appBar: AppBar(title: const Text("Home page "),),
      body:  Center(
        child: Text("Home Page", style: Theme.of(context).textTheme.headline5,),
      ),
    );
  }
}