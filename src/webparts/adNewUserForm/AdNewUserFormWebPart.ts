import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'AdNewUserFormWebPartStrings';
import AdNewUserForm from './components/AdNewUserForm';
// custom
import { sp } from "@pnp/sp/presets/core";

export interface IAdNewUserFormWebPartProps {
  description: string; // placeholder
  context: WebPartContext; // needed for people picker and some comps
  webpartWidth: number; // actual webpartwidth for responsive ... apparently static.. only initial
}

export default class AdNewUserFormWebPart extends BaseClientSideWebPart<IAdNewUserFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAdNewUserFormWebPartProps> = React.createElement(
      AdNewUserForm,
      {
        description: this.properties.description,
        context: this.context,
        webpartWidth: this.width
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public async onInit(): Promise<void> {

    return super.onInit().then(_ => {

      // other init code may be present

      sp.setup({
        spfxContext: this.context
      });
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
