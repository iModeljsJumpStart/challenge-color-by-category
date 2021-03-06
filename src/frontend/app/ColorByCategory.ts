/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { IModelConnection, SelectionSetEvent, Viewport } from "@bentley/imodeljs-frontend";
import { Id64String } from "@bentley/bentleyjs-core";

// Implement the methods of this class to complete the challenge.
export class ColorByCategoryListener {
  // private _colorIndex = 0;
  // private static _colors = [ColorDef.fromString("red"), ColorDef.fromString("green"), ColorDef.fromString("blue"), ColorDef.fromString("orange"), ColorDef.fromString("cyan"), ColorDef.fromString("yellow")];
  private static _cleanupListener: () => void;

  // Construct a new object and register it to be called when an element is selected
  // Implements a singleton pattern so that only one listener will be created
  public static setupListener(vp: Viewport) {
    if (undefined !== this._cleanupListener)
      return;

    const listener = new ColorByCategoryListener();
    this._cleanupListener = vp.iModel.selectionSet.onChanged.addListener(listener._elementSelected);
  }

  // Disable the listener
  public static cleanupListener() {
    if (this._cleanupListener)
      this._cleanupListener();
  }

  // Cycle through the pre-defined colors
  /*
  private getNextColor() {
    // To use this method, you must first uncomment _colors and _colorIndex above
    const current = ColorByCategoryListener._colors[this._colorIndex];
    this._colorIndex = (this._colorIndex + 1) % ColorByCategoryListener._colors.length;
    return current;
  }
  */

  // Override the color of the input elements to this.getNextColor()
  private overrideElementColors(_ids: Id64String[]) {

    // Challenge: You need to fill in this method to complete the challenge.
    //            This method should call this.getNextColor()

  }

  // Query the iModel for all elements that have the same category as the input element.
  // Return a list of elementIds
  private async queryForAllMatchingCategoryId(inputId: Id64String, iModel: IModelConnection): Promise<Id64String[]> {
    const query = `SELECT others.eCInstanceId id
       FROM bis.geometricElement3d selected, bis.geometricElement3d others
       WHERE others.category.id = selected.category.id AND selected.ecinstanceid = ` + inputId;
    const rows = [];
    for await (const row of iModel.query(query)) rows.push(row);
    return rows.map((row) => row.id);
  }

  // Override the color of every element that belongs to the same category as the selected element.
  private async overrideColorForCategoryOfSelectedElement(inputId: Id64String, iModel: IModelConnection) {
    const idsToColorize = await this.queryForAllMatchingCategoryId(inputId, iModel);
    this.overrideElementColors(idsToColorize);
  }

  // Query the iModel for the name of the category for the input element.
  /*
  private async queryForCategoryName(inputId: string, iModel: IModelConnection): Promise<Id64String[]> {

    // Bonus: You need to fill in this method to complete the bonus challenge.
    return [];

  }
  */

  // Show a message to the user containing the name of the category for the input element.
  private async showMessageForCategoryOfSelectedElement(_inputId: string, _iModel: IModelConnection) {

    // Bonus: You need to fill in this method to complete the bonus challenge.
    //        This method should call this.queryForCategoryName(inputId, iModel)

  }

  // This method will be called whenever an element is selected
  private _elementSelected = async (ev: SelectionSetEvent) => {
    if (ev.set.elements.size === 1) {
      const sourceElementId = Array.from(ev.set.elements).pop();
      // console.log("ID of selected element: " + sourceElementId);

      if (sourceElementId) {
        await this.overrideColorForCategoryOfSelectedElement(sourceElementId, ev.set.iModel);

        await this.showMessageForCategoryOfSelectedElement(sourceElementId, ev.set.iModel);
      }
    }
  }
}
