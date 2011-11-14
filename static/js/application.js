(function() {
  var AsciiCharacter, Asciify, DropZone, ImageFile, ReadFiles, Upload;
  DropZone = (function() {
    /*
      Handle drag and drop functionality.
      */    function DropZone(selector) {
      selector = $(selector);
      selector.bind('dragover', function() {
        return false;
      }).bind('drop', this.drop);
    }
    DropZone.prototype.drop = function(event) {
      var files;
      files = event.originalEvent.dataTransfer.files;
      new ReadFiles(files);
      return false;
    };
    return DropZone;
  })();
  Upload = (function() {
    /*
      Upload files and clear out the resulting FileList.
      */    function Upload(selector) {
      var input, upload;
      input = $(selector);
      upload = input.siblings('a');
      input.change(function() {
        var files;
        files = this.files;
        new ReadFiles(files);
        return this.value = "";
      });
      upload.click(function(event) {
        input.click();
        return false;
      });
    }
    return Upload;
  })();
  ReadFiles = (function() {
    /*
      Read the image files and create new images.
      */    function ReadFiles(files) {
      var file, _fn, _i, _len;
      _fn = function(file) {
        var reader;
        reader = new FileReader;
        reader.onload = function(event) {
          var name, result;
          name = file.name;
          result = event.target.result;
          return new ImageFile(name, result);
        };
        return reader.readAsDataURL(file);
      };
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _fn(file);
      }
      return;
    }
    return ReadFiles;
  })();
  ImageFile = (function() {
    /*
      Create a new thumbnail for a newly dropped or uploaded image file.
      */    function ImageFile(name, result) {
      var ascii;
      this.name = name;
      this.result = result;
      ascii = new Asciify(result);
      console.log(ascii.art);
    }
    return ImageFile;
  })();
  Asciify = (function() {
    /*
      Turn an image into Ascii text. The height of the output is determined
      by the 8x5 dimensions of the bounding box.
      */    function Asciify(image_data, max_width) {
      var blue, characters, data, green, height, height_range, letter, max_height, num, red, width, width_range, _i, _j, _k, _l, _len, _len2, _ref, _ref2, _results, _results2;
      if (max_width == null) {
        max_width = 80;
      }
      max_height = Math.floor(.3 * max_width);
      data = this.create_canvas_image(image_data, max_width, max_height);
      _ref = [
        (function() {
          _results = [];
          for (var _i = 1; 1 <= max_height ? _i <= max_height : _i >= max_height; 1 <= max_height ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this), (function() {
          _results2 = [];
          for (var _j = 1; 1 <= max_width ? _j <= max_width : _j >= max_width; 1 <= max_width ? _j++ : _j--){ _results2.push(_j); }
          return _results2;
        }).apply(this)
      ], height_range = _ref[0], width_range = _ref[1];
      characters = [];
      for (_k = 0, _len = height_range.length; _k < _len; _k++) {
        height = height_range[_k];
        for (_l = 0, _len2 = width_range.length; _l < _len2; _l++) {
          width = width_range[_l];
          num = (height * max_width + width) * 4;
          _ref2 = [data[num], data[num + 1], data[num + 2]], red = _ref2[0], green = _ref2[1], blue = _ref2[2];
          letter = new AsciiCharacter(red, green, blue);
          characters.push(letter.value);
        }
        characters.push('\n');
      }
      this.art = characters.join('');
    }
    Asciify.prototype.create_canvas_image = function(image_data, max_width, max_height) {
      var ctx, data, image;
      image = new Image;
      image.src = image_data;
      ctx = document.getElementById('canvas').getContext('2d');
      ctx.drawImage(image, 0, 0, max_width, max_height);
      data = ctx.getImageData(0, 0, max_width, max_height).data;
      return data;
    };
    return Asciify;
  })();
  AsciiCharacter = (function() {
    /*
      Return the Ascii character representation for RGB input.
      */    function AsciiCharacter(red, green, blue) {
      var ascii, brightness;
      ascii = "@8CLftli;:,. ";
      brightness = (3 * red + 4 * green + blue) >>> 3;
      this.value = ascii[Math.floor(brightness / 256 * ascii.length)];
    }
    return AsciiCharacter;
  })();
  (function() {
    new DropZone('.dropzone');
    return new Upload('#files');
  })();
}).call(this);
