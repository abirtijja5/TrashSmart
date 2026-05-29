import 'package:flutter/material.dart';

import 'drawer.item.widget.dart';
import 'main.drawer.header.widget.dart';

class MainDrawer extends StatelessWidget {
  const MainDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Put the menu in an  Array
    List<dynamic> menus = [
      {"title":"Home", "route":"/", "leadingIcon":Icons.home, "trailingIcon":Icons.arrow_forward},
      {"title":"Users", "route":"/users", "leadingIcon":Icons.person, "trailingIcon":Icons.arrow_forward},
      {"title":"Trashcan", "route":"/trashcan", "leadingIcon":Icons.restore_from_trash_outlined, "trailingIcon":Icons.arrow_forward},
      {"title":"Trash", "route":"/trash", "leadingIcon":Icons.restore_from_trash, "trailingIcon":Icons.arrow_forward}

    ];
    return  Drawer(
      child: Column(
        children:  [
          const MainDrawerHeader(),
          Expanded(
                // Loop
              child: ListView.separated(
                 itemBuilder: (context, index){
                   // Pass parameters to DrawerItemWidget
                    return DrawerItemWidget(
                        title: menus[index]["title"],
                        leadingIcon: menus[index]["leadingIcon"],
                        trailingIcon: menus[index]["trailingIcon"],
                        onAction: (){
                          // Close the menu
                          Navigator.pop(context);
                          // Open the menu
                          Navigator.pushNamed(context, menus[index]["route"]);
                        }
                    );
                  },
                  separatorBuilder: (context, index){
                    return const Divider(height: 5,);
                  },
                  itemCount: menus.length
              )
          )
        ],
      ),
    );

  }
}
