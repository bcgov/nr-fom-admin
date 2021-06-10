import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SpatialFeaturePublicResponse, SpatialObjectCodeEnum } from 'core/api';
import { SpatialTypeMap } from 'core/utils/constants/constantUtils';

@Component({
  selector: 'app-shape-info',
  templateUrl: './shape-info.component.html',
  styleUrls: ['./shape-info.component.scss']
})
export class ShapeInfoComponent implements OnInit {

  slideColor: ThemePalette = 'primary';
  public displayedColumns: string[] = ['shape_id', 'type', 'name', 'submission_type', 'area_length'];

  @Input('spatialDetail')
  projectSpatialDetail: SpatialFeaturePublicResponse[];
  @Input()
  showAsTable: boolean = false;
  @Input()
  disableToggle: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public getFomSpatialTypeDesc(source: string) {
    switch(source) {
      case SpatialTypeMap.get(SpatialObjectCodeEnum.CutBlock)['source'].toLowerCase():
        return SpatialTypeMap.get(SpatialObjectCodeEnum.CutBlock)['desc'];

      case SpatialTypeMap.get(SpatialObjectCodeEnum.RoadSection)['source'].toLowerCase():
        return SpatialTypeMap.get(SpatialObjectCodeEnum.RoadSection)['desc'];

      case SpatialTypeMap.get(SpatialObjectCodeEnum.Wtra)['source'].toLowerCase():
        return SpatialTypeMap.get(SpatialObjectCodeEnum.Wtra)['desc'];
        
      default:
        return null;
    }
  }

}
