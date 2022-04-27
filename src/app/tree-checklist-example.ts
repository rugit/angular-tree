import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

/**
 * Node for to-do item
 */
export class DirectoryNode {
  _id: string;
  directoryName: string;
  directoryPath: string;
  files: any;
  subDirectories: DirectoryNode[];
}

export class DirectoryFlatNode {
  _id: string;
  directoryName: string;
  directoryPath: string;
  files: any;
  level: number;
  expandable: boolean;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  _id: '62696231a157e5246a483dc5',
  directoryName: '',
  directoryPath: '/',
  files: null,
  subDirectories: [
    {
      _id: '62696236a157e5246a483dc6',
      directoryName: 'upload',
      directoryPath: '//',
      files: null,
      subDirectories: [
        {
          _id: '6269623da157e5246a483dc7',
          directoryName: 'demo_insertion',
          directoryPath: '//upload/',
          files: null,
          subDirectories: [
            {
              _id: '62696243a157e5246a483dc8',
              directoryName: 'nextgen_adjustments',
              directoryPath: '//upload/demo_insertion/',
              files: [
                {
                  _id: '62696247a157e5246a483dc9',
                  fileName: 'Adjustments 2021 - 4 Facilities - Q4.csv',
                  filePath: '//upload/demo_insertion/nextgen_adjustments/',
                  filePreProcessorId: null,
                  fileSize: 25846439,
                  fileStatus: 'Not Inserted',
                },
              ],
              subDirectories: null,
            },
            {
              _id: '62696247a157e5246a483dca',
              directoryName: 'nextgen_aging',
              directoryPath: '//upload/demo_insertion/',
              files: [
                {
                  _id: '6269624ca157e5246a483dcb',
                  fileName: 'Aging - 2021 - 4 Facilities.csv',
                  filePath: '//upload/demo_insertion/nextgen_aging/',
                  filePreProcessorId: null,
                  fileSize: 2955341,
                  fileStatus: 'Not Inserted',
                },
              ],
              subDirectories: null,
            },
            {
              _id: '6269624ca157e5246a483dcc',
              directoryName: 'nextgen_charges',
              directoryPath: '//upload/demo_insertion/',
              files: [
                {
                  _id: '62696252a157e5246a483dcd',
                  fileName: 'Charges 2021 - 4 Facilities - Q3.csv',
                  filePath: '//upload/demo_insertion/nextgen_charges/',
                  filePreProcessorId: null,
                  fileSize: 16079869,
                  fileStatus: 'Not Inserted',
                },
                {
                  _id: '62696252a157e5246a483dce',
                  fileName: 'Charges 2021 - 4 Facilities - Q4.csv',
                  filePath: '//upload/demo_insertion/nextgen_charges/',
                  filePreProcessorId: null,
                  fileSize: 14816293,
                  fileStatus: 'Not Inserted',
                },
              ],
              subDirectories: null,
            },
            {
              _id: '62696252a157e5246a483dcf',
              directoryName: 'nextgen_notes',
              directoryPath: '//upload/demo_insertion/',
              files: [
                {
                  _id: '62696258a157e5246a483dd0',
                  fileName: 'Nextgent Notes - Combined .csv',
                  filePath: '//upload/demo_insertion/nextgen_notes/',
                  filePreProcessorId: null,
                  fileSize: 14959631,
                  fileStatus: 'Not Inserted',
                },
              ],
              subDirectories: null,
            },
            {
              _id: '62696258a157e5246a483dd1',
              directoryName: 'nextgen_payments',
              directoryPath: '//upload/demo_insertion/',
              files: [
                {
                  _id: '6269625ea157e5246a483dd2',
                  fileName: 'Payments 2021 - 4 Facilities - Q3.csv',
                  filePath: '//upload/demo_insertion/nextgen_payments/',
                  filePreProcessorId: null,
                  fileSize: 21461394,
                  fileStatus: 'Not Inserted',
                },
                {
                  _id: '6269625ea157e5246a483dd3',
                  fileName: 'Payments 2021 - 4 Facilities - Q4.csv',
                  filePath: '//upload/demo_insertion/nextgen_payments/',
                  filePreProcessorId: null,
                  fileSize: 24568731,
                  fileStatus: 'Not Inserted',
                },
              ],
              subDirectories: null,
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<DirectoryNode[]>([]);

  get data(): DirectoryNode[] {
    return this.dataChange.value;
  }

  constructor() {
    const data = TREE_DATA;
    // this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): DirectoryNode[] {
    return Object.keys(obj).reduce<DirectoryNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new DirectoryNode();
      node.directoryName = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.subDirectories = this.buildFileTree(value, level + 1);
        } else {
          node.directoryName = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: DirectoryNode, name: string) {
    if (parent.subDirectories) {
      parent.subDirectories.push({ directoryName: name } as DirectoryNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: DirectoryNode, name: string) {
    node.directoryName = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'tree-checklist-example',
  templateUrl: 'tree-checklist-example.html',
  styleUrls: ['tree-checklist-example.css'],
  providers: [ChecklistDatabase],
})
export class TreeChecklistExample {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<DirectoryFlatNode, DirectoryNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<DirectoryNode, DirectoryFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: DirectoryFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<DirectoryFlatNode>;

  treeFlattener: MatTreeFlattener<DirectoryNode, DirectoryFlatNode>;

  dataSource: MatTreeFlatDataSource<DirectoryNode, DirectoryFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<DirectoryFlatNode>(
    true /* multiple */
  );

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<DirectoryFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    // _database.dataChange.subscribe((data) => {
    this.dataSource.data = _database.data;
    console.log(_database.data);
    // });
  }

  getLevel = (node: DirectoryFlatNode) => node.level;

  isExpandable = (node: DirectoryFlatNode) => node.expandable;

  getChildren = (node: DirectoryNode): DirectoryNode[] => node.subDirectories;

  hasChild = (_: number, _nodeData: DirectoryFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: DirectoryFlatNode) =>
    _nodeData.directoryName === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: DirectoryNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.directoryName === node.directoryName
        ? existingNode
        : new DirectoryFlatNode();
    flatNode.directoryName = node.directoryName;
    flatNode.level = level;
    flatNode.expandable = !!node.subDirectories?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: DirectoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: DirectoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: DirectoryFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: DirectoryFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: DirectoryFlatNode): void {
    let parent: DirectoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: DirectoryFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: DirectoryFlatNode): DirectoryFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: DirectoryFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: DirectoryFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }
}

/**  Copyright 2022 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
