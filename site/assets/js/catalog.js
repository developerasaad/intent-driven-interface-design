/* Formwork catalogue — demo data.
   Products, prices and specifications are fictional.
   Photography is loaded from Unsplash. */

(function () {
  'use strict';

  const image = (id, width = 1200) =>
    'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + width + '&q=80';

  const finishColors = {
    'Natural oak': '#c9a97c',
    'White oak': '#d6bb96',
    'Blackened oak': '#2f2d29',
    'Blackened ash': '#3a3732',
    'Ash': '#d8c7ac',
    'Pale linen': '#d9d2c4',
    'Oat wool': '#cfc6b4',
    'Clay wool': '#b98e72',
    'Charcoal wool': '#4a4a47',
    'Cognac leather': '#9a5b36',
    'Black leather': '#2b2926',
    'Brass': '#b08d57',
    'Black': '#1d1e1a',
    'Chalk': '#e7e4da',
    'Blackened steel': '#3b3b37'
  };

  const products = [
    {
      id: 'alder-lounge-chair',
      ref: 'FW-01',
      name: 'Alder Lounge Chair',
      category: 'Seating',
      price: 1480,
      material: 'Wool blend, oak',
      featured: true,
      description:
        'A low lounge chair with a wide seat and a light oak frame. The upholstery is a dense wool blend with a soft hand, and the frame is oiled rather than lacquered so it can be refreshed over time.',
      dimensions: 'W 72 × D 78 × H 74 cm',
      seat: 'Seat height 40 cm',
      care:
        'Vacuum the upholstery with a soft brush. Blot spills promptly with a clean cloth. Refresh the oak frame once a year with a natural furniture oil.',
      finishes: ['Natural oak', 'Blackened ash', 'Pale linen'],
      images: [
        {
          id: '1580480055273-228ff5388ef8',
          alt: 'Beige upholstered lounge chair with splayed oak legs on a pale floor',
          caption: 'Alder lounge chair in pale linen'
        },
        {
          id: '1615529182904-14819c35db37',
          alt: 'Living room with a green sofa, oak table and woven pendant lights',
          caption: 'Shown in a living room setting'
        }
      ]
    },
    {
      id: 'plinth-dining-table',
      ref: 'FW-02',
      name: 'Plinth Dining Table',
      category: 'Tables',
      price: 2450,
      material: 'Solid white oak',
      featured: true,
      description:
        'A dining table for six to eight, with a thick white oak top and a simple trestle base. The edge is eased by hand and the surface is finished with a matte hardwax oil.',
      dimensions: 'W 220 × D 95 × H 74 cm',
      seat: 'Seats 6–8',
      care:
        'Wipe with a damp cloth and dry immediately. Re-oil the surface once or twice a year, or when water no longer beads on the wood.',
      finishes: ['White oak', 'Blackened oak'],
      images: [
        {
          id: '1604578762246-41134e37f9cc',
          alt: 'Oak dining table with a pendant light in a bright room',
          caption: 'Plinth table in white oak'
        },
        {
          id: '1513694203232-719a280e022f',
          alt: 'Living space with a dark sofa, oak-topped dresser and a plant',
          caption: 'In a quiet living space'
        }
      ]
    },
    {
      id: 'radius-console',
      ref: 'FW-03',
      name: 'Radius Console',
      category: 'Storage',
      price: 1320,
      material: 'Solid oak',
      featured: true,
      description:
        'A low console with two push-latch doors and an open shelf. Rounded corners and a recessed base keep it light in a hallway or behind a sofa.',
      dimensions: 'W 160 × D 40 × H 78 cm',
      seat: 'Two doors, one open shelf',
      care:
        'Dust with a dry cloth. Wipe marks with a slightly damp cloth and dry immediately. Keep out of direct sun to limit colour change.',
      finishes: ['White oak', 'Ash'],
      images: [
        {
          id: '1530018607912-eff2daa1bac4',
          alt: 'Oak console with a plant against a white wall',
          caption: 'Radius console in white oak'
        },
        {
          id: '1513694203232-719a280e022f',
          alt: 'Living space with a dark sofa, oak-topped dresser and a plant',
          caption: 'A console in a living space'
        }
      ]
    },
    {
      id: 'halo-pendant',
      ref: 'FW-04',
      name: 'Halo Pendant',
      category: 'Lighting',
      price: 540,
      material: 'Spun brass',
      featured: true,
      description:
        'A pendant in spun brass with a matte interior. Hang one low over a table, or a row of three along a counter; the light is warm and direct.',
      dimensions: 'Ø 32 × H 24 cm',
      seat: 'Cord 200 cm',
      care:
        'Dust with a dry cloth. Brass will develop a patina with use. Have the fitting installed by a qualified electrician.',
      finishes: ['Brass', 'Blackened steel'],
      images: [
        {
          id: '1540932239986-30128078f3c5',
          alt: 'Three brass pendant lights against a dark ceiling',
          caption: 'Halo pendants in brass'
        },
        {
          id: '1615529182904-14819c35db37',
          alt: 'Living room with a green sofa, oak table and woven pendant lights',
          caption: 'Pendants over a sitting room'
        }
      ]
    },
    {
      id: 'cove-sofa',
      ref: 'FW-05',
      name: 'Cove Sofa',
      category: 'Seating',
      price: 3260,
      material: 'Wool, oak',
      description:
        'A three-seat sofa with a low back and a deep seat, sized for everyday lounging. Upholstered in a textured wool with solid oak feet, it sits close to the floor without feeling heavy.',
      dimensions: 'W 210 × D 92 × H 76 cm',
      seat: 'Seat height 42 cm',
      care:
        'Vacuum weekly with a soft upholstery brush. Rotate cushions regularly. Blot spills rather than rubbing. Professional clean when needed.',
      finishes: ['Oat wool', 'Clay wool', 'Charcoal wool'],
      images: [
        {
          id: '1581428982868-e410dd047a90',
          alt: 'Cream sofa with a low oak coffee table in a light-filled room',
          caption: 'Cove sofa in oat wool'
        },
        {
          id: '1615529182904-14819c35db37',
          alt: 'Living room with a green sofa, oak table and woven pendant lights',
          caption: 'A sofa in a living room'
        }
      ]
    },
    {
      id: 'line-work-desk',
      ref: 'FW-06',
      name: 'Line Work Desk',
      category: 'Tables',
      price: 1680,
      material: 'Oak, powder-coated steel',
      description:
        'A slim desk with a solid oak top, a shallow drawer and powder-coated steel legs. Sized for a laptop, a lamp and not much else.',
      dimensions: 'W 140 × D 65 × H 74 cm',
      seat: 'One drawer',
      care:
        'Wipe the top with a damp cloth and dry immediately. Re-oil the oak as needed. Wipe the steel legs with a soft cloth.',
      finishes: ['White oak', 'Blackened oak'],
      images: [
        {
          id: '1611269154421-4e27233ac5c7',
          alt: 'Oak desk with a chair beside a tall window',
          caption: 'Line desk in white oak'
        },
        {
          id: '1524758631624-e2822e304c36',
          alt: 'Bright studio interior with desks and lounge seating',
          caption: 'In the studio'
        }
      ]
    },
    {
      id: 'stack-sideboard',
      ref: 'FW-07',
      name: 'Stack Sideboard',
      category: 'Storage',
      price: 2180,
      material: 'Oak, painted case',
      description:
        'A sideboard with three drawers and two adjustable shelves. The oak top sits proud of the painted case, and a recessed plinth keeps the piece from feeling bulky.',
      dimensions: 'W 180 × D 45 × H 72 cm',
      seat: 'Three drawers, two shelves',
      care:
        'Dust regularly with a dry cloth. Wipe the painted case with a damp cloth and dry immediately. Avoid abrasive cleaners.',
      finishes: ['White oak', 'Chalk'],
      images: [
        {
          id: '1513694203232-719a280e022f',
          alt: 'White dresser with an oak top, plant and table lamp',
          caption: 'Stack sideboard in chalk'
        },
        {
          id: '1530018607912-eff2daa1bac4',
          alt: 'Oak console with a plant against a white wall',
          caption: 'A storage piece in a quiet room'
        }
      ],
      imagePosition: '72% 50%'
    },
    {
      id: 'task-lamp',
      ref: 'FW-08',
      name: 'Task Lamp',
      category: 'Lighting',
      price: 320,
      material: 'Powder-coated steel',
      description:
        'A task lamp with a weighted base, an adjustable arm and a small shade. Powder-coated steel, with a fabric cord and an in-line switch.',
      dimensions: 'W 18 × D 40 × H 48 cm',
      seat: 'Cord 200 cm',
      care:
        'Dust with a dry cloth. Do not use solvents on the powder-coated finish. Have the wiring checked by a qualified electrician.',
      finishes: ['Black', 'Chalk'],
      images: [
        {
          id: '1507473885765-e6ed057f782c',
          alt: 'Black task lamp with an adjustable arm against a white wall',
          caption: 'Task lamp in black steel'
        },
        {
          id: '1611269154421-4e27233ac5c7',
          alt: 'Oak desk with a chair beside a tall window',
          caption: 'On the Line desk'
        }
      ]
    },
    {
      id: 'marlow-sofa',
      ref: 'FW-09',
      name: 'Marlow Sofa',
      category: 'Seating',
      price: 2890,
      material: 'Leather, oak',
      description:
        'A three-seat sofa in cognac leather with a slim oak frame. The leather is aniline-dyed and will darken with use; the cushions are firm enough to hold their shape.',
      dimensions: 'W 196 × D 88 × H 78 cm',
      seat: 'Seat height 43 cm',
      care:
        'Dust leather with a soft dry cloth. Keep out of direct sun. Condition sparingly with a neutral leather cream.',
      finishes: ['Cognac leather', 'Black leather'],
      images: [
        {
          id: '1540574163026-643ea20ade25',
          alt: 'Tan leather three-seat sofa against a white wall',
          caption: 'Marlow sofa in cognac leather'
        },
        {
          id: '1513694203232-719a280e022f',
          alt: 'Living space with a dark sofa, oak-topped dresser and a plant',
          caption: 'In a living room'
        }
      ]
    },
    {
      id: 'slate-dining-table',
      ref: 'FW-10',
      name: 'Slate Dining Table',
      category: 'Tables',
      price: 2680,
      material: 'Blackened oak',
      description:
        'A dining table in blackened oak with a soft matte surface. The dark finish makes the grain read quietly, and the base is set in from the edge for legroom.',
      dimensions: 'W 240 × D 100 × H 74 cm',
      seat: 'Seats 8',
      care:
        'Wipe with a damp cloth and dry immediately. Avoid standing water. Re-oil the surface when water no longer beads.',
      finishes: ['Blackened oak', 'White oak'],
      images: [
        {
          id: '1600607687920-4e2a09cf159d',
          alt: 'Black dining table with grey chairs in a modern room',
          caption: 'Slate table in blackened oak'
        },
        {
          id: '1600607687644-c7171b42498f',
          alt: 'Bedroom with a dark bed frame and large windows',
          caption: 'Dark timber in a quiet room'
        }
      ]
    },
    {
      id: 'tern-armchair',
      ref: 'FW-11',
      name: 'Tern Armchair',
      category: 'Seating',
      price: 1180,
      material: 'Wool, ash',
      description:
        'A curved armchair with a high back and a small footprint. The shell is upholstered in clay wool over a solid ash frame, with a seat height that works at a desk or a dining table.',
      dimensions: 'W 78 × D 82 × H 80 cm',
      seat: 'Seat height 45 cm',
      care:
        'Vacuum with a soft brush. Blot spills promptly. Keep away from radiators and direct sun.',
      finishes: ['Clay wool', 'Oat wool'],
      images: [
        {
          id: '1540638349517-3abd5afc5847',
          alt: 'Curved beige armchair in a dark room with heavy curtains',
          caption: 'Tern armchair in clay wool'
        },
        {
          id: '1487015307662-6ce6210680f1',
          alt: 'Wooden chair and round table in warm afternoon light',
          caption: 'A material study in oak'
        }
      ]
    },
    {
      id: 'column-sconce',
      ref: 'FW-12',
      name: 'Column Sconce',
      category: 'Lighting',
      price: 290,
      material: 'Powder-coated steel',
      description:
        'A wall sconce in chalk-painted steel with an adjustable head. It throws light up and down, and works beside a bed or at the end of a hallway.',
      dimensions: 'W 12 × D 22 × H 30 cm',
      seat: 'Hardwired',
      care:
        'Dust with a dry cloth. Disconnect power before cleaning. Have the fitting installed by a qualified electrician.',
      finishes: ['Chalk', 'Black'],
      images: [
        {
          id: '1533090161767-e6ffed986c88',
          alt: 'White wall sconce beside a plant and a round clock',
          caption: 'Column sconce in chalk'
        }
      ]
    }
  ];

  const formatPrice = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);

  window.FORMWORK = {
    products: products,
    categories: ['Seating', 'Tables', 'Storage', 'Lighting'],
    finishColors: finishColors,
    image: image,
    formatPrice: formatPrice
  };
})();
