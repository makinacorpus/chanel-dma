# -*- coding: utf-8 -*-

import logging
from Products.CMFCore.utils import getToolByName

from plone.memoize.instance import memoize
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from collective.flowplayer.utils import properties_to_dict, \
                                        flash_properties_to_dict
from collective.flowplayer.interfaces import IFlowPlayable
from collective.flowplayer.interfaces import IMediaInfo, IFlowPlayerView
from collective.flowplayer.exportimport import _PROPERTIES

# Properties are defined here, because if they are defined in propertiestool.xml,
# all properties are re-set the their initial state if you reinstall product
# in the quickinstaller.

_PROPERTIES = [
    dict(name='loop', type_='boolean', value=False),
    dict(name='showPlaylist', type_='boolean', value=True),
    dict(name='initialVolumePercentage', type_='int', value=50),
    dict(name='clip/autoPlay', type_='boolean', value=True),
    dict(name='clip/autoBuffering', type_='boolean', value=True),
    dict(name='clip/scaling', type_='string', value='fit'),
    dict(name='plugins/controls/volume', type_='boolean', value=False),
    dict(name='key', type_='string', value=''),
    dict(name='plugins/controls/showVolumeSlider', type_='boolean', value=False),
    dict(name='plugins/controls/timeColor', type_='string', value='#f9dbad'),
    dict(name='plugins/controls/scrubber', type_='boolean', value=True),
    dict(name='plugins/controls/backgroundGradient', type_='string', value='none'),
    dict(name='plugins/controls/autoHide', type_='string', value='always'),
    dict(name='plugins/controls/bufferColor', type_='string', value='#a3a3a3'),
    dict(name='plugins/controls/progressColor', type_='string', value='#4599ff'),
    dict(name='plugins/controls/width', type_='string', value='70%'),
    dict(name='plugins/controls/bottom', type_='string', value='10'),
    dict(name='plugins/controls/left', type_='string', value='50%'),
    dict(name='plugins/controls/borderRadius', type_='string', value='0px'),
    dict(name='plugins/controls/tooltipColor', type_='string', value='#000000'),
    dict(name='plugins/controls/tooltipTextColor', type_='string', value='#f9dbad'),
    dict(name='plugins/controls/opacity', type_='string', value='1'),
    dict(name='plugins/controls/sliderGradient', type_='string', value='none'),
    dict(name='plugins/controls/bufferGradient', type_='string', value='none'),
    dict(name='plugins/controls/buttonColor', type_='string', value='#f9dbad'),
    dict(name='plugins/controls/backgroundColor', type_='string', value='transparent'),
    dict(name='plugins/controls/height', type_='string', value='18'),
    dict(name='plugins/controls/border', type_='string', value='0px'),
    dict(name='plugins/controls/progressGradient', type_='string', value='none'),
    dict(name='plugins/controls/display', type_='string', value='block'),
    dict(name='plugins/controls/scrubberBarHeightRatio', type_='string', value='0.1'),
    dict(name='plugins/controls/sliderColor', type_='string', value='#000000'),
    dict(name='plugins/controls/timeBgHeightRatio', type_='string', value='0.8'),
    dict(name='plugins/controls/timeBorderRadius', type_='string', value='20'),
    dict(name='plugins/controls/timeFontSize', type_='string', value='10px'),
    dict(name='plugins/controls/timeBgColor', type_='string', value='transparent'),
    dict(name='plugins/controls/timeBorder', type_='string', value='0px solid rgba(0, 0, 0, 0.3)'),
    dict(name='plugins/controls/durationColor', type_='string', value='#b8d9ff'),
    dict(name='play/opacity', type_='string', value='0.5'),
    dict(name='play/height', type_='string', value='30'),
    dict(name='play/width', type_='string', value='30'),
    dict(name='canvas/backgroundGradient', type_='string', value='none'),
    dict(name='canvas/backgroundColor', type_='string', value='#000000'),
    dict(name='bgcolor', type_='string', value='#000000'),
    dict(name='wmode', type_='string', value='#000000'),
]

def registerProperties(context, logger=None):
    ptool = getToolByName(context, 'portal_properties')
    props = ptool.flowplayer_properties
    
    if not props.hasProperty('plugins/controls/url'):
        if props.hasProperty('player'):
            props.manage_delProperties(['player'])
    
    for prop in _PROPERTIES:
        if not props.hasProperty(prop['name']):
            props.manage_addProperty(prop['name'], prop['value'], prop['type_'])

def setupVarious(context):
    if context.readDataFile('collective.flowplayer.txt') is None:
        return

    logger = context.getLogger('collective.flowplayer')
    portal = context.getSite()
    registerProperties(portal, logger)

    ptool = getToolByName(context, 'portal_properties')
    props = ptool.flowplayer_properties
    
    if not props.hasProperty('plugins/controls/url'):
        if props.hasProperty('player'):
            props.manage_delProperties(['player'])
    
    for prop in _PROPERTIES:
        if not props.hasProperty(prop['name']):
            props.manage_addProperty(prop['name'], prop['value'], prop['type_'])
