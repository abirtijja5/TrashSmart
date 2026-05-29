import 'package:flutter/material.dart';

class TrashPage extends StatelessWidget {
  const TrashPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar: AppBar(title: const Text("Trash Page"),),
      body:  Center(
        child: Text("Trash Page", style: Theme.of(context).textTheme.headline5,),
      ),
    );
  }
}
